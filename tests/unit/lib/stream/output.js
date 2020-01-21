'use strict';

const expect = require('chai').expect;
const stream = require('stream');

describe('lib/stream/output', () => {
    const StreamOutput = require(testing.path.root + '/lib/stream/output');

    it('transform', (done) => {
        const buffer = [];
        const streamOutput = new StreamOutput();
        streamOutput.on('data', (data) => {
            buffer.push(data);
        });
        streamOutput.on('finish', () => {
            try {
                const compare = [
                    '["test1",{"date":"2020-01-01T10:20:30.000Z"}]',
                    '["test2",{"date":"2020-01-02T10:20:30.000Z"}]',
                    '["test3"]',
                ].join('\n') + '\n';
                expect(buffer.join('')).to.be.equal(compare);

                done();
            } catch (e) {
                done(e);
            }
        });
        streamOutput.write([
            'test1',
            {date: new Date('2020-01-01T10:20:30.000Z')},
        ]);
        streamOutput.write([
            'test2',
            {date: new Date('2020-01-02T10:20:30.000Z')},
        ]);
        streamOutput.write([
            'test3',
        ]);
        streamOutput.end();
        expect(streamOutput).to.be.instanceof(stream.Transform);
    });

    it('transform error', (done) => {
        const bufferData = [];
        const bufferError = [];
        const streamOutput = new StreamOutput();
        streamOutput.on('error', (e) => {
            bufferError.push(e);
        });
        streamOutput.on('data', (data) => {
            bufferData.push(data);
        });
        streamOutput.on('finish', () => {
            try {
                expect(bufferError[0]).to.be.instanceof(Error);
                expect(bufferError).to.have.lengthOf(1);

                const compare = [
                    '["test1",{"i":1}]',
                    '["test3",{"i":3}]',
                ].join('\n') + '\n';
                expect(bufferData.join('')).to.be.equal(compare);

                done();
            } catch (e) {
                done(e);
            }
        });
        streamOutput.write([
            'test1',
            {i: 1},
        ]);
        const failJson = {};
        failJson.toJSON = () => {
            throw new Error('test');
        };
        streamOutput.write([
            'test2',
            failJson,
        ]);
        streamOutput.write([
            'test3',
            {i: 3},
        ]);
        streamOutput.end();
        expect(streamOutput).to.be.instanceof(stream.Transform);
    });
});
