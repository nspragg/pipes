'use strict';

import fs from 'fs';
const Transform = require('stream').Transform;
import LineStream from 'byline';

class CatSream extends Transform {
  constructor(file) {
    super();
    this._fstream = fs.createReadStream(file).pipe(new LineStream());
    this._buffer = [];
  }

  _transform(data, encoding, next) {
    this._buffer.push(data);
    next();
  }

  _flush(next) {
    this._fstream.on('readable', () => {
      let chunk;
      while ((chunk = this._fstream.read()) != null) {
        this._buffer.push(String(chunk));
      }
    });

    this._fstream.on('end', () => {
      this._buffer.forEach((data) => {
        this.push(data);
      });
      next();
    });
  }
}

module.exports = CatSream;
