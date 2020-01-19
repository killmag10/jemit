const expect = require('chai').expect;

const stream = require('stream');

describe('lib/stream/input', () => {
    const StreamInput = require(testing.path.root + '/lib/stream/input');

    it('read', (done) => {
        let buffer = [];
        let streamInput = new StreamInput();
        streamInput.on('data', (data) => {
            buffer.push(data);
        });
        streamInput.on('finish', () => {
            try {
                expect(buffer[0]).to.be.deep.equal([
                    'test',
                    {i: "1"}
                ]);
                expect(buffer[1]).to.be.deep.equal([
                    'test',
                    {i: "2"}
                ]);
                expect(buffer[2]).to.be.deep.equal([
                    'test',
                    {i: 3}
                ]);
                expect(buffer[3]).to.be.deep.equal([
                    'empty'
                ]);
                expect(buffer).to.have.lengthOf(4);

                done();
            } catch (e) {
                done(e);
            }
        })
        streamInput.write('["test",{"i":"1"}]\n["');
        streamInput.write('test",');
        streamInput.write('{"i":"2"}]\n["test",{"i":3}]\n["empty"]\n');
        streamInput.end();
        expect(streamInput).to.be.instanceof(stream.Transform);
    });

    it('parse error', (done) => {
        let bufferData = [];
        let bufferError = [];
        let streamInput = new StreamInput();
        streamInput.on('error', (e) => {
            bufferError.push(e);
        });
        streamInput.on('data', (data) => {
            bufferData.push(data);
        });
        streamInput.on('finish', () => {
            try {
                expect(bufferError[0]).to.be.instanceof(SyntaxError);
                expect(bufferError[1]).to.be.instanceof(SyntaxError);
                expect(bufferError).to.have.lengthOf(2);

                expect(bufferData[0]).to.be.deep.equal([
                    'test',
                    {i: "1"}
                ]);
                expect(bufferData[1]).to.be.deep.equal([
                    'test',
                    {i: "2"}
                ]);
                expect(bufferData[2]).to.be.deep.equal([
                    'empty'
                ]);
                expect(bufferData).to.have.lengthOf(3);

                done();
            } catch (e) {
                done(e);
            }
        })
        streamInput.write('["test",{"i":"1"}]\nWHAT?\n["test",');
        streamInput.write('{"i":"2"}]\ntest",{"i":3}]\n["empty"]\n');
        streamInput.end();
        expect(streamInput).to.be.instanceof(stream.Transform);
    });

    it('parse maxParseBufferSize', (done) => {
        let bufferData = [];
        let bufferError = [];
        let streamInput = new StreamInput({
            maxParseBufferSize: 9
        });
        streamInput.on('error', (e) => {
            bufferError.push(e);
        });
        streamInput.on('data', (data) => {
            bufferData.push(data);
        });
        streamInput.on('finish', () => {
            try {
                expect(bufferError[0]).to.be.instanceof(RangeError);
                expect(bufferError).to.have.lengthOf(1);

                expect(bufferData[0]).to.be.deep.equal([
                    'test'
                ]);
                expect(bufferData).to.have.lengthOf(1);

                done();
            } catch (e) {
                done(e);
            }
        })
        streamInput.write('["test"]\n');
        streamInput.write('["test-');
        streamInput.write('long"]\n');
        streamInput.end();
        expect(streamInput).to.be.instanceof(stream.Transform);
    });
});
