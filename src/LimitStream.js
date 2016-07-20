'use strict';

const Transform = require('stream').Transform;

class LimitStream extends Transform {
  constructor(n) {
    super();
    this._limit = n;
    this._current = 0;
  }

  _transform(data, encoding, cb) {
    this._current++;

    if (this._current <= this._limit) {
      this.push(data);
    }
    // TODO: terminate the stream. No point of continuing. 
    cb();
  }
}

module.exports = LimitStream;