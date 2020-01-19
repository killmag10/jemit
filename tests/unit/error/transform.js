const expect = require('chai').expect;

describe('error/transform', () => {
    const TransformError = require(testing.path.root + '/lib/error/transform');

    it('new TransformError()', () => {
        const error = new TransformError();
        expect(error).to.be.a.instanceof(Error);
        expect(error.errors).to.be.a.instanceof(Array);
    });
});
