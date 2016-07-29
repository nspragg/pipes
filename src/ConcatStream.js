import async from 'async';

import {
  toArray
} from './arrays';

import fs from 'fs';
import {
  Transform
} from 'stream';

import LineStream from 'byline';

function createTextStream(file, cb) {
  const fstream = fs.createReadStream(file);
  fstream.on('error', cb);

  return fstream.pipe(new LineStream());
}

class CatStream extends Transform {
  constructor(files) {
    super();
    this._files = toArray(files);
    this._buffer = [];
  }

  _transform(data, encoding, next) {
    this._buffer.push(data);
    next();
  }

  _consume(fstream, cb) {
    fstream.on('end', cb);

    fstream.on('readable', () => {
      let chunk;
      while ((chunk = fstream.read()) !== null) {
        this._buffer.push(String(chunk));
      }
    });
  }

  _flushBuffer() {
    this._buffer.forEach((data) => {
      this.push(data);
    });
  }

  _flush(next) {
    const fstreams = this._files.map((fstream) => {
      return createTextStream(fstream, next);
    });

    async.eachSeries(fstreams, (fstream, cb) => {
      this._consume(fstream, cb);
    }, (err) => {
      if (err) return next(err);

      this._flushBuffer();
      next();
    });
  }
}

module.exports = CatStream;
