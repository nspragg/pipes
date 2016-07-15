'use strict';

const _ = require('../src/pipes');
const assert = require('assert');
const fs = require('fs');

const FILE = __dirname + '/fixtures/loremIpSum.txt';

describe('pipes', function() {
    let fstream = null;

    beforeEach(() => {
        fstream = fs.createReadStream(FILE, {
            encoding: 'utf8'
        });
    });

    it('filters data from stream', (done) => {
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
        const expected = ['Curabitur vel purus purus. Vestibulum pretium libero eu feugiat porttitor. '];

        _(fstream)
            .zcat()
            .run((err, data) => {
                assert.ifError(err);
                assert.deepEqual(data, expected);
                done();
            });
    });
});
