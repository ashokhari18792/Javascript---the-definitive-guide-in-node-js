// This node program reads text from standard input and
// computes the frequency of each letter in that text.
// displays a histogram of the most used characters.
// requires node v12 or higher to run.

// In Unix-style environment we can invoke the program as below.
// > node charfreq.js < corpus.txt
// or use below command to find the frequency of the occurence of
// characters in the current program.

// this class extends map to so that get method returns
// specified default value instead of null when the key is not
//  in the Map
class DefaultMap extends Map {
  constructor(defaultValue) {
    super();
    this.defaultValue = defaultValue;
  }

  get(key) {
    if (this.has(key)) {
      return super.get(key);
    } else {
      return this.defaultValue;
    }
  }
}

// This class computes and displays letter frequency histograms
class Histogram {
  constructor() {
    this.letterCounts = new DefaultMap(0); // Map from letters to their respective counts
    this.totalLetters = 0; // how many letters in all
  }

  // this metod updates the histogram with the letters of text.
  add(text) {
    // Remove whitespace from the text, and convert to uppercase
    text = text.replace(/\s/g, ' ').toUpperCase;

    // Loop through the characters of the text
    for (let char of text) {
      let count = this.letterCounts.get(char); // get old count
      this.letterCounts.set(char, count + 1);
      this.totalLetters++;
    }
  }

  // convert the histogram to a string that displays and ASCII graph
  toString() {
    // convert Map to an Array of [key, value] Arrays
    let entries = [...this.letterCounts];

    // sort the array by count and then alphabetically
    entries.sort((a, b) => {
      if (a[1] === b[1]) {
        // if counts are same sort alphabetically
        return a[0] < b[0] ? -1 : 1;
      } else {
        return b[1] - a[1];
      }
    });

    // convert the counts to percentages
    for (let entry of entries) {
      entry[1] = (entry[1] / this.totalLetters) * 100;
    }

    // drop entries less than 1%
    entries = entries.filter((entry) => entry[1] > 1);

    // convert each entry to a line of text
    let lines = entries.map(
      ([l, n]) => `${l}: ${'#'.repeat(Math.round(n))} ${n.toFixed(2)}`
    );

    // return concatenated lines represented by \n chars
    return lines.join('\n');
  }
}

// Below async function (promise returning) creates a histogram object asynchronously
// it asynchronously reads chunks of text from std i/p and adds those chunks to the histogram
// when it reaches the end of the stream it returns the final histogram object.
async function histogramFromStdin() {
  process.stdin.setEncoding('utf-8');

  // Read unicode strings not bytes of data
  let histogram = new Histogram();

  for await (let chunk of process.stdin) {
    histogram.add(chunk);
  }

  return histogram;
}

// below function creates a Histogram object from std i/p and then prints the Histogram
histogramFromStdin().then((histogram) => {
  console.log(histogram.toString());
});
