'use strict';

const stream = require('stream');
const defaults = require('../defaults');

/**
 * Output stream
 * @extends stream.Transform
 * @see {@link https://nodejs.org/dist/latest-v12.x/docs/api/stream.html}
 */
class JemitOutputStream extends stream.Transform {
    /**
     * Create a Jemit transform stream.
     * @param {Object} [options]
     * @param {String} [options.delimiter]
     * @param {Number} [options.maxChunkSize]
     * @param {Number} [options.writableHighWaterMark]
     * @param {Number} [options.readableHighWaterMark]
     */
    constructor(options) {
        const objectOptions = defaults();
        Object.assign(objectOptions, options);

        super({
            writableObjectMode: true,
            writableHighWaterMark: objectOptions.writableHighWaterMark,
            readableHighWaterMark: objectOptions.readableHighWaterMark,
        });
        this.options = objectOptions;
    }

    /**
     * @see {@link https://nodejs.org/dist/latest-v12.x/docs/api/stream.html#stream_transform_transform_chunk_encoding_callback}
     * @param  {any}      dataObj - input data
     * @param  {String}   encoding
     * @param  {Function} callback
     */
    _transform(dataObj, encoding, callback) {
        try {
            let buffer = Buffer.from(
                JSON.stringify(dataObj) + this.options.delimiter);

            while (buffer.length > 0) {
                this.push(buffer.slice(0, this.options.maxChunkSize));
                buffer = buffer.slice(this.options.maxChunkSize);
            }
            callback();
        } catch (e) {
            callback(e);
        }
    }
}

module.exports = JemitOutputStream;
