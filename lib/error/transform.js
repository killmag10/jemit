'use strict';

/**
 * Error happened on a stream transform call.
 * @extends Error
 */
class TransformError extends Error {
    /**
     * Constructor of TransformError.
     * @param {String} [message='Error on transformation.'] - error message
     * @param {Array}  [errors=[]] - Array of sub errors.
     */
    constructor(message = 'Error on transformation.', errors = []) {
        super(message);
        this.name = 'TransformError';
        this.errors = errors;
    }
}

module.exports = TransformError;
