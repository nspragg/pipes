const Transform = require('stream').Transform;

const WORD_SIZE = 4;

function isAsciiChar(char) {
  return (char >= 32 && char <= 126) || char === 12;
}

function strings(buffer) {
  const ascii = [];
  let wordChars = [];
  for (let i = 0; i < buffer.length; i++) {
    if (isAsciiChar(buffer[i])) {
      wordChars.push(String.fromCharCode(buffer[i]));
    } else {
      if (wordChars.length >= WORD_SIZE) {
        const text = wordChars.reduce((a, b) => {
          return a + b;
        });
        ascii.push(text);
      }
      wordChars = [];
    }
  }
  return ascii;
}

class StringStream extends Transform {
  constructor() {
    super();
  }

  _transform(data, encoding, cb) {
    const text = strings(data);
    text.forEach((ascii) => {
      this.push(ascii);
    });

    cb();
  }
}

module.exports = StringStream;
