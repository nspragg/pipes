'use strict';

const _ = require('../src/pipes');
const assert = require('assert');
const fs = require('fs');

const FILE = __dirname + '/fixtures/loremIpSum.txt';
const COMPRESSED_FILE = __dirname + '/fixtures/compressed.txt.gz';

describe('pipes', function () {
  let fstream = null;

  beforeEach(() => {
    fstream = fs.createReadStream(FILE, {
      encoding: 'utf8'
    });
  });

  it('returns a matching line for a given pattern', (done) => {
    const expected = ['Curabitur vel purus purus. Vestibulum pretium libero eu feugiat porttitor. '];

    _(fstream)
      .grep(/Curabitur/)
      .run((err, data) => {
        assert.ifError(err);
        assert.deepEqual(data, expected);
        done();
      });
  });

  it('uncompresses data from stream', (done) => {
    const expected = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus purus sem, rhoncus eu ornare ut, faucibus id ante.'];

    const compressedStream = fs.createReadStream(COMPRESSED_FILE);
    _(compressedStream)
      .zcat()
      .run((err, data) => {
        assert.ifError(err);
        assert.deepEqual(data, expected);
        done();
      });
  });
});
