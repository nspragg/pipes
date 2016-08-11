# pipes

[![Build Status](https://travis-ci.org/nspragg/pipes.svg)](https://travis-ci.org/nspragg/pipes) [![Coverage Status](https://coveralls.io/repos/github/nspragg/pipes/badge.svg?branch=master)](https://coveralls.io/github/nspragg/pipes?branch=master)

> [INACTIVE] - Treat Node streams like Unix style pipelines

* [Installation](#installation)
* [Features](#features)
* [Demo](#demo)
* [Usage](#usage)
* [API](#api)
* [Instance methods](#instance-methods)
* [Test](#test)
* [Contributing](#contributing)

## Installation

```
npm install --save pipes
```

## Features

* Familiar features inspired and named after common Unix and Linux commands
* Supports compressed files
* Supports custom filtering
* Simple interface
* Supports promises and callbacks

## Usage

The example below searches a gzipped file for `myPattern`:

```js
const file = fs.createReadStream('/tmp/myFile.txt.gz');

_.(file)
  .zcat()
  .grep(/myPattern/i)
  .toArray((err, data) => {
    console.log(`found ${data}`);
  });
```

#### File search

Find all lines containing `myPattern`, ignoring case:

```js
const file = fs.createReadStream('/tmp/myFile.txt.gz');

_.(file)
  .grep(/myPattern/i)
  .toArray((err, data) => {
    console.log(`found ${data}`);
  });
```

#### Concatenation

Find all lines containing `myPattern`, ignoring case:

```js
const file1 = fs.createReadStream('/tmp/myFile1.txt.gz');
const file2 = fs.createReadStream('/tmp/myFile2.txt.gz');

_.(file1)
  .cat(file2)
  .toArray((err, data) => {
    console.log(data);
  });
```

#### Searching binary files

Find all ascii text match `mypattern`:

```js
const binaryFile = fs.createReadStream('/tmp/myFile1.txt.gz');

_.(binaryFile)
  .strings()
  .grep(/mypattern/)
  .toArray((err, data) => {
    console.log(data);
  });
```

## API

### Static methods

### `_.(stream) -> Pipeline`

##### Parameters
* stream

##### Returns
Returns a Pipeline.

### `_.fromFile(filename) -> Pipeline`

##### Parameters
* filename

##### Returns
Returns a Pipeline.

### `_.fromRequest(url) -> Pipeline`

##### Parameters
* url

##### Returns
Returns a Pipeline.

### Pipeline Instance methods

### `.cat(files...) -> Pipeline`
Concatenate files

##### Parameters
* One or more files. Arrays will be unpacked.

##### Returns
* Returns a Pipeline

### `.zcat(files...) -> Pipeline`
Same as `.cat` but for gzipped files

##### Parameters
* One or more gzipped files. Arrays will be unpacked.

##### Returns
* Returns a Pipeline

### `.grep(pattern) -> Pipeline`
Returns matching lines for a given pattern

##### Parameters
* Accepts a String or regex

##### Returns
* Returns a Pipeline

### `.strings() -> Pipeline`

Extracts ASCII text from binary data
##### Parameters
* None

##### Returns
* Returns a Pipeline

### `.toArray() -> Promise`

Returns a Promise. If the Promise fulfils, the fulfilment value is an array containing the stream's contents.

##### Parameters
* None

##### Returns
* Returns a Pipeline

## Test

```
npm test
```

To generate a test coverage report:

```
npm run coverage
```
## Contributing

* If you're unsure if a feature would make a good addition, you can always [create an issue](https://github.com/nspragg/pipes/issues/new) first.
* We aim for 100% test coverage. Please write tests for any new functionality or changes.
* Any API changes should be fully documented.
* Make sure your code meets our linting standards. Run `npm run lint` to check your code.
* Maintain the existing coding style. There are some settings in `.jsbeautifyrc` to help.
* Be mindful of others when making suggestions and/or code reviewing.
