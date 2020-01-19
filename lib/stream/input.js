'use strict';

const stream = require('stream');
const defaults = require('../defaults');

/**
 * Input stream
 * @extends stream.Transform
 * @see {@link https://nodejs.org/dist/latest-v12.x/docs/api/stream.html}
 */
class JemitInputStream extends stream.Transform {
    /**
     * Create a Jemit transform stream.
     * @param {Object} [options]
     * @param {String} [options.delimiter]
     * @param {Number} [options.maxParseBufferSize]
     * @param {Number} [options.writableHighWaterMark]
     * @param {Number} [options.readableHighWaterMark]
     */
    constructor(options) {
        const objectOptions = defaults();
        Object.assign(objectOptions, options);

        super({
            readableObjectMode: true,
            writableHighWaterMark: objectOptions.writableHighWaterMark,
            readableHighWaterMark: objectOptions.readableHighWaterMark,
        });
        this.options = objectOptions;
        this.buffer = Buffer.alloc(0);
    }

    /**
     * @see {@link https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_transform_transform_chunk_encoding_callback}
     * @param  {any}      data - input data
     * @param  {String}   encoding
     * @param  {Function} callback
     */
    _transform(data, encoding, callback) {
        try {
            const inputBuffer = Buffer.from(data);

            if (
                (this.buffer.length + inputBuffer.length) >
                    this.options.maxParseBufferSize
            ) {
                throw new RangeError('Buffer exceeded maxParseBufferSize!');
            }
            this.buffer = Buffer.concat([this.buffer, inputBuffer]);

            // stop on uncomplete object
            if (this.buffer.indexOf(this.options.delimiter) === -1) {
                callback();
                return;
            }
            // split by delimiter
            const list = this.buffer.toString().split(this.options.delimiter);
            // add unused end back to buffer
            this.buffer = Buffer.from(list.pop());

            list.forEach((item) => {
                try {
                    this.push(JSON.parse(item));
                } catch (e) {
                    process.nextTick(() => this.emit('error', e));
                }
            });

            callback();
        } catch (e) {
            this.buffer = Buffer.alloc(0);
            callback(e);
        }
    }
}

module.exports = JemitInputStream;
