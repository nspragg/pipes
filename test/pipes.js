'use strict';

const _ = require('../src/pipes');
const assert = require('assert');
const fs = require('fs');
const request = require('request');
const sinon = require('sinon');

const LORUM_IP_SUM = __dirname + '/fixtures/loremIpSum.txt';
const BINARY_FILE = __dirname + '/fixtures/binaryFile';
const LORUM_IP_SUM_GZ = __dirname + '/fixtures/loremIpSum2.txt.gz';
const COMPRESSED_FILE = __dirname + '/fixtures/compressed.txt.gz';
const URL = 'http://some.api.co.uk/feed';
const API_RESPONSE = require('./fixtures/apiResponse');

describe('pipes', () => {
  let fstream = null;

  beforeEach(() => {
    fstream = fs.createReadStream(LORUM_IP_SUM, {
      encoding: 'utf8'
    });
  });

  describe('.fromFile()', () => {
    it('creates a file stream from a fiven file', (done) => {
      _.fromFile(LORUM_IP_SUM)
        .run((err, lines) => {
          assert.ifError(err);
          assert.equal(lines.length, 16);
          done();
        });
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

  it('returns the first n lines', (done) => {
    const expected = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus purus sem, rhoncus eu ornare ut, faucibus id ante.',
      'Nulla tincidunt tortor est. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.'
    ];

    _(fstream)
      .head(2)
      .run((err, data) => {
        assert.ifError(err);
        assert.deepEqual(data, expected);
        done();
      });
  });

  describe('.cat', () => {
    it('concatenates stream with a file', (done) => {
      _(fstream)
        .cat(LORUM_IP_SUM)
        .run((err, data) => {
          assert.ifError(err);
          assert.equal(data.length, 32);
          done();
        });
    });

    it('concatenates stream with > 1 file', (done) => {
      _(fstream)
        .cat(LORUM_IP_SUM, LORUM_IP_SUM)
        .run((err, data) => {
          assert.ifError(err);
          assert.equal(data.length, 48);
          done();
        });
    });

    it('passes through data when not given any args', (done) => {
      _(fstream)
        .cat()
        .run((err, data) => {
          assert.ifError(err);
          assert.equal(data.length, 16);
          done();
        });
    });

    it('returns an error when cat fails', (done) => {
      _(fstream)
        .cat('bad file')
        .run((err) => {
          assert.ok(err);
          done();
        });
    });
  });
});
