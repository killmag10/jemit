const expect = require('chai').expect;

const stream = require('stream');

describe('lib/input', () => {
    const Input = require(testing.path.root + '/lib/input');
    const Output = require(testing.path.root + '/lib/output');

    it('transmit', (done) => {
        let buffer = [];
        let input = new Input();
        let output = new Output();
        let streamInput = input.stream;
        let streamOutput = output.stream;
        streamOutput.pipe(streamInput);
        input.on('test1', (data) => {
            buffer.push(data);
        });
        input.on('test2', (data) => {
            buffer.push(data);
        });
        streamInput.on('finish', () => {
            try {
                expect(buffer[0]).to.be.deep.equal({i: "1"});
                expect(buffer[1]).to.be.deep.equal({i: "2"});
                expect(buffer[2]).to.be.deep.equal(undefined);
                expect(buffer).to.have.lengthOf(3);

                done();
            } catch (e) {
                done(e);
            }
        });
        output.emit('test1', {i: "1"});
        output.emit('test1', {i: "2"});
        output.emit('test2');
        output.emit('test3');
        output.end();

        expect(input).to.be.instanceof(Object);
        expect(output).to.be.instanceof(Object);
    });

    it('transmit error output', (done) => {
        let bufferData = [];
        let bufferError = [];
        let input = new Input();
        let output = new Output();
        let streamInput = input.stream;
        let streamOutput = output.stream;
        streamOutput.pipe(streamInput);
        output.on('error', (e) => {
            bufferError.push(e);
        });
        input.on('test1', (data) => {
            bufferData.push(data);
        });
        input.on('test2', (data) => {
            bufferData.push(data);
        });
        streamInput.on('finish', () => {
            try {
                expect(bufferError).to.have.lengthOf(1);
                expect(bufferData[0]).to.be.deep.equal({i: "1"});
                expect(bufferData).to.have.lengthOf(1);

                done();
            } catch (e) {
                done(e);
            }
        });
        output.emit('test1', {i: "1"});
        let failJson = {};
        failJson.toJSON = () => {
            throw new Error('test');
        };
        output.emit('test2', failJson);
        output.end();

        expect(input).to.be.instanceof(Object);
        expect(output).to.be.instanceof(Object);
    });

    it('transmit error input', (done) => {
        let bufferData = [];
        let bufferError = [];
        let input = new Input();
        let streamInput = input.stream;
        input.on('error', (e) => {
            bufferError.push(e);
        });
        input.on('test', (data) => {
            bufferData.push(data);
        });
        streamInput.on('finish', () => {
            try {
                expect(bufferError).to.have.lengthOf(1);
                expect(bufferData[0]).to.be.deep.equal({i: 1});
                expect(bufferData).to.have.lengthOf(1);

                done();
            } catch (e) {
                done(e);
            }
        });
        streamInput.write('["test",{"i":1}]\nfail\n');
        streamInput.end();
    });

    it('transmit drain', (done) => {
        let results = [];
        let output = new Output({
            writableHighWaterMark: 10
        });
        let streamOutput = output.stream;
        streamOutput.cork();

        const amount = streamOutput.writableHighWaterMark + 1;

        streamOutput.on('finish', () => {
            try {
                expect(results).to.have.lengthOf(amount);

                done();
            } catch (e) {
                done(e);
            }
        });

        (async () => {
            for (var i = 0; i < amount -1; i++) {
                 results.push(output.emit('test', {i: i}));
            }
            streamOutput.uncork();
            results.push(await output.emit('test', {i: i}));
            await output.end();
        })()
    });
});
