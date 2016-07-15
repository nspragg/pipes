'use strict';

const _ = require('../src/pipes');
const assert = require('assert');
const fs = require('fs');

const LORUM_IP_SUM = __dirname + '/fixtures/loremIpSum.txt';
const BINARY_FILE = __dirname + '/fixtures/binaryFile';
const LORUM_IP_SUM_GZ = __dirname + '/fixtures/loremIpSum2.txt.gz';
const COMPRESSED_FILE = __dirname + '/fixtures/compressed.txt.gz';

describe('pipes', function () {
  let fstream = null;

  beforeEach(() => {
    fstream = fs.createReadStream(LORUM_IP_SUM, {
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

  it('returns matching from a gzipped file', (done) => {
    const expected = ['Curabitur vel purus purus. Vestibulum pretium libero eu feugiat porttitor. '];

    const compressedStream = fs.createReadStream(LORUM_IP_SUM_GZ);
    _(compressedStream)
      .zcat()
      .grep(/Curabitur/)
      .run((err, data) => {
        assert.ifError(err);
        assert.deepEqual(data, expected);
        done();
      });
  });

  it('returns lines matching a given pattern from a binary file', (done) => {
    const expected = ['xBro'];

    const binaryFstream = fs.createReadStream(BINARY_FILE);
    _(binaryFstream)
      .strings()
      .grep(/xBro/)
      .run((err, data) => {
        assert.ifError(err);
        assert.deepEqual(data, expected);
        done();
      });
  });
});
