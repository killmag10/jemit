'use strict';

const JemitOuputStream = require('./stream/output');
const EventEmitter = require('events').EventEmitter;

/**
 * Jemit output
 * @extends EventEmitter
 */
class JemitOuput extends EventEmitter {
    /** @inheritdoc */
    constructor(options) {
        super(options);
        this._emit = this.emit;

        this.stream = new JemitOuputStream(this.options);
        this.stream.on('error', (e) => this._emit('error', e));

        this.emit = async function emit(event, data) {
            return new Promise((resolve, reject) => {
                const buffer = [event];
                if (data !== undefined) {
                    buffer.push(data);
                }
                if (this.stream.write(buffer)) {
                    return resolve();
                }

                const drain = () => {
                    this.stream.removeListener('drain', drain);
                    this.stream.removeListener('end', drain);
                    return resolve();
                };

                this.stream.on('drain', drain);
                this.stream.on('end', drain);
            });
        };
    }

    /**
     * close the stream.
     * @return {Promise}
     */
    async end() {
        this.stream.end();
    }
}

module.exports = JemitOuput;
