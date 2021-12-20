const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();

const baseUrl = 'http://localhost:8080/api';

describe("when stubbed", () => {
    let responseObject = null;
    let responseBody = null;
    beforeEach(() => {
        this.get = sinon.stub(request, 'get');
        responseObject = {
            statusCode: 200,
            headers: {
                'content-type': 'application/json'
            }
        };
        responseBody = {
            status: 'success',
            data: {
                "actualValue":"1001",
                "targetValue":"1000",
                "year": "1337",
                "goalDesc": "cool",
                "sid": "01"
            }
        }
    });

    afterEach(() => {
        request.get.restore();
    });

    describe('GET performance record by id', () => {
        it('should return the performance record according to id', (done) => {
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${baseUrl}/performance-record/:01`, (err, res, body) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.status.should.eql('success');
                body.data.should.include.keys(
                    'actualValue', 'targetValue', 'year', 'goalDesc', 'sid'
                )

                body.data.actualValue.should.eql('1001');
                body.data.targetValue.should.eql('1000');
                body.data.year.should.eql('1337');
                body.data.goalDesc.should.eql('cool');
                body.data.sid.should.eql('01');
                done();
            })
        })

        it('should throw an error if the record does not exist', (done) => {
            request.get(`${baseUrl}/performance-record/:000`, (err, res, body) => {
                res.statusCode.should.eql(404);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.status.should.eql('error');
                body.message.should.eql('That record does not exist.');
            })
            done();
        })
    })
})