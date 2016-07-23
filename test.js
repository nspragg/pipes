var Readable = require('stream').Readable;

var rs = new Readable;
rs.push('beep\n');
rs.push('boop\n');
rs.push(null);
rs.push('aoop\n');

rs.pipe(process.stdout);
