const sinon = require('sinon');
const request = require('request');
const chai = require('chai');
const should = chai.should();

const baseUrl = 'http://localhost:8080/api';

describe("when stubbed", () => {
    let responseObject = null;
    let responseBody = null;
    beforeEach(() => {
        responseObject = {
            statusCode: 200,
            headers: {
                'content-type': 'application/json'
            }
        };
        responseBody = {
            status: 'success',
            data: {
                "sid": "01",
                "year": "1337",
                "value":"1001",
                "performanceRecords":"5",
                "salesOrders":"5"
            }
        }
        this.get = sinon.stub(request, 'get');
    });

    describe('GET bonus computation by id and year', () => {
        it('should return the bonus computation according to id and year', (done) => {
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${baseUrl}/bonus-computation/:01/:1337`, (err, res, body) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.status.should.eql('success');
                body.data.should.include.keys(
                    'sid', 'year', 'value', 'performanceRecords', 'salesOrders'
                )

                body.data.sid.should.eql('01');
                body.data.year.should.eql('1337');
                body.data.value.should.eql('1001');
                body.data.performanceRecords.should.eql('5');
                body.data.salesOrders.should.eql('5');
                done();
            })
        })
    })
})