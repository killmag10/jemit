const expect = require('chai').expect;

describe('index', () => {
    let index = require(testing.path.root + '/index');

    it('exports', () => {
        expect(index.Output).to.be.equal(require(testing.path.root + '/lib/output'));
        expect(index.Input).to.be.equal(require(testing.path.root + '/lib/input'));
        expect(index.OutputStream).to.be.equal(require(testing.path.root + '/lib/stream/output'));
        expect(index.InputStream).to.be.equal(require(testing.path.root + '/lib/stream/input'));
    });
});
