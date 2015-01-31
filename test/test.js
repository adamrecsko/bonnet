var bonnet = require('../index.js');
var wrap = bonnet.wrap;
var expect = require('expect.js');
var Promise = require('promise');





describe('bonnet', function () {
    
    /** Test functions*/
    function testAsyncTask(i) {
                return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        resolve(i);
                    }, 10);
                });
    }
    
    function testAsyncError(){
               return new Promise(function (resolve, reject) {
                    setTimeout(function () {
                        reject("test error");
                    }, 10);
                });
    }
    
    
    describe('constructor', function () {
        it('should resolve promise with the result', function () {
            var ITERTO = 10;
            var expectedResult = ITERTO * (ITERTO + 1) / 2; // Sum of first N number
            var firstNNumber = function* () {
                var sum = 0;
                for (var i = 0; i <= ITERTO; i++) {
                    yield sum = sum + i;
                }
                return sum;
            };

            return bonnet(firstNNumber).then(function (data) {
                expect(data).to.be(expectedResult);
            });
        });

        it('should wait for the yielded promise to fulfilled', function () {
            var expectedResult = "test0123456";


            var yieldPromise = function* () {
                var result = "test";
                for (var i = 0; i < 7; i++) {
                    result += yield testAsyncTask(i);
                }
                return result;
            };

            return bonnet(yieldPromise).then(function (data) {
                expect(data).to.be(expectedResult);
            });
        });

        it('should reject if the yielded promise is rejected', function () {
            var yieldPromise = function* () {
                yield testAsyncError();
                return true;
            };

           return bonnet(yieldPromise).then(null, function (error) {
                expect(error).to.be("test error");
            });
        });

        it('should reject promise with the error throwned', function () {
            return  bonnet(function* () {
                throw new Error("TEST ERROR");
                return true;
            }).then(null, function (error) {
                expect(error).to.be.a(Error);
                expect(error.message).to.be("TEST ERROR");
            });
        });

        it('should throw an exception if not a function given', function () {
            expect(function () {
                bonnet("Not a function");
            }).to.throwError();
        });
    });

    describe("wrapper", function () {
        it("should wrap generator into bonnet function", function () {
            var testFunction = function* (a, b) {
                var result = yield a + b;
                return result;
            };
            var wrappedFunction = bonnet.wrap(testFunction);
            return wrappedFunction(10, 11).then(function (data) {
                expect(data).to.be(21);
            });
        });
    });
});