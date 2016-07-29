const Transform = require('stream').Transform;

class ThroughStream extends Transform {
  _transform(data, encoding, cb) {
    this.push(data);
    cb();
  }
}

module.exports = ThroughStream;
