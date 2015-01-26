var bonnet = require('../index.js');
var expect = require('expect.js');
var wrap = bonnet.wrap;

describe('bonnet', function () {
    describe('constructor', function () {
        it('should resolve promise with the result', function (done) {
            var ITERTO = 10;
            var expectedResult = ITERTO * (ITERTO + 1) / 2; // Sum of first N number
            var firstNNumber = function* () {
                var sum = 0;
                for (var i = 0; i <= ITERTO; i++) {
                    yield sum = sum + i;
                }
                return sum;
            };

            bonnet(firstNNumber).then(function (data) {
                expect(data).to.be(expectedResult);
                done();
            }, function (error) {
                console.log(error);
            });
        });

        it('should reject promise with the error throwned', function (done) {
            bonnet(function* () {
                throw new Error("TEST ERROR");
                return true;
            }).then(null, function (error) {
                expect(error).to.be.a(Error);
                expect(error.message).to.be("TEST ERROR");
                done();
            });
        });

        it('should throw an exception if not a function given', function () {
            expect(function () {
                bonnet("Not a function");
            }).to.throwError();
        });
    });

    describe("wrapper", function () {
        it("should wrap generator into bonnet function", function (done) {
            var testFunction = function* (a, b) {
                var result =
                    yield a + b;
                return result;
            };
            var wrappedFunction = bonnet.wrap(testFunction);
            wrappedFunction(10, 11).then(function (data) {
                expect(data).to.be(21);
                done();
            });
        });
    });
});