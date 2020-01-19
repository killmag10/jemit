'use strict';

const JemitInputStream = require('./stream/input');
const EventEmitter = require('events').EventEmitter;

/**
 * Jemit Input
 * @extends EventEmitter
 */
class JemitInput extends EventEmitter {
    /** @inheritdoc */
    constructor(options) {
        super(options);
        this.stream = new JemitInputStream(this.options);
        this.stream.on('data', ([event, data]) => {
            this.emit(event.toString(), data);
        });
        this.stream.on('error', (e) => this.emit('error', e));
    }
}

module.exports = JemitInput;
