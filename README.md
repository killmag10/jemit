# jemit

A user friendly JSON stream module with event support.

[![Travis](https://img.shields.io/travis/com/killmag10/jemit/master)](https://travis-ci.com/killmag10/jemit)
[![npm](https://img.shields.io/npm/dm/jemit.svg)](https://www.npmjs.com/package/jemit)
[![npm](https://img.shields.io/npm/v/jemit.svg)](https://www.npmjs.com/package/jemit)


## Usage

### Example

#### Using events

```js
const jemit = require('jemit');

let input = new jemit.Input();
let output = new jemit.Output();

output.stream.pipe(input.stream);
input.on('error', (e) => {
    console.error(e);
});
input.on('test', (data) => {
    console.log('test1:', data);
});
output.emit('test', {i: 1});
output.end();
```

#### Using the streams

```js
const jemit = require('jemit');

let inputStream = new jemit.InputStream();
let outputStream = new jemit.OutputStream();

outputStream.pipe(inputStream);
inputStream.on('error', (e) => {
    console.error(e);
});
inputStream.on('data', (data) => {
    console.log('data:', data);
});
outputStream.write({i: 1});
outputStream.end();
```

## API

### jemit.Input

the Input is a [NodeJS EventEmitter][node_ee]

#### new jemit.Input([options])

**options:** see: [InputStream](#jemitinputstream)

#### .stream

The jemit [InputStream](#jemitinputstream) is accessible via **.stream**

#### Event: *

All events what will be received from the stream will be emitted.

#### Event: 'error'

The error event is emitted on every error with the stream.
Errors will normally not stop the streaming, but you will lose affected data.


### jemit.Output

#### new jemit.Output([options])

**options:** see: [OutputStream](#jemitoutputstream)

#### .emit(event, [object])

**event:** <string>
**object:** <any>

*This is __not__ the original emit() method from the EventEmitter*

#### .stream

The jemit [OutputStream](#jemitoutputstream) is accessible via **.stream**

#### Event: 'error'

The error event is emitted on every error with the stream.
Errors will normally not stop the streaming, but you will lose affected data.


### jemit.InputStream

The stream is a NodeJS Transform Stream.
For the methods see: [NodeJS Steam API][node_stream]

#### new jemit.InputStream([options])

**options:**

| key                   | default        | description                                   |
| --------------------- | -------------- | ----------------------------------------------|
| delimiter             | '\n'           | delemiter to split stream (no need to change) |
| maxParseBufferSize    | 32768          | max size for the parsing buffer               |
| writableHighWaterMark | NodeJS default | [NodeJS Doc][node_whwm]                       |
| readableHighWaterMark | NodeJS default | [NodeJS Doc][node_rhwm]                       |


### jemit.OutputStream

The stream is a NodeJS Transform Stream.
For the methods see: [NodeJS Steam API][node_stream]

#### new jemit.OutputStream([options])

**options:**

| key                   | default        | description                                   |
| --------------------- | -------------- | ----------------------------------------------|
| delimiter             | '\n'           | delemiter to split stream (no need to change) |
| maxChunkSize          | 16384          | max chunk size for internal writing (push)    |
| writableHighWaterMark | NodeJS default | [NodeJS Doc][node_whwm]                       |
| readableHighWaterMark | NodeJS default | [NodeJS Doc][node_rhwm]                       |


[node_whwm]: https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_writable_writablehighwatermark
[node_rhwm]: https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_readable_readableHighWaterMark
[node_stream]: https://nodejs.org/dist/latest-v12.x/docs/api/stream.html
[node_ee]: https://nodejs.org/dist/latest-v12.x/docs/api/events.html#events_class_eventemitter
