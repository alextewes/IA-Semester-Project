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
                "_id": "123456",
                "employeeId": "01",
                "firstname": "John",
                "lastname": "Doe",
                "dob": "19.09.1999",
                "department": "Sales"
            }
        }
        this.get = sinon.stub(request, 'get');
    });

    describe('GET Salesman find by id', () => {
        it('should return the salesman according to id', (done) => {
            this.get.yields(null, responseObject, JSON.stringify(responseBody));
            request.get(`${baseUrl}/salesman/01`, (err, res, body) => {
                res.statusCode.should.eql(200);
                res.headers['content-type'].should.contain('application/json');
                body = JSON.parse(body);
                body.status.should.eql('success');
                body.data.should.include.keys(
                    '_id', 'employeeId', 'firstname', 'lastname', 'dob', 'department'
                )

                body.data._id.should.eql('123456');
                body.data.employeeId.should.eql('01');
                body.data.firstname.should.eql('John');
                body.data.lastname.should.eql('Doe');
                body.data.dob.should.eql('19.09.1999');
                body.data.department.should.eql('Sales');
                done();
            })
        })
    })
})