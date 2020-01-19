'use strict';

module.exports = function getDefaults() {
    return {
        delimiter: '\n',
        maxParseBufferSize: 32768,
        maxChunkSize: 16384,
    };
};
