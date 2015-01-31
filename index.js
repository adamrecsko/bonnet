/**
 * Exports.
 */
module.exports = bonnet;
module.exports.wrap = wrap;

/**
 * Deps.
 */
var Promise = require("promise");

/**
 * bonnet wrapper.
 */
function wrap(generator) {
    if (typeof generator !== "function") {
        throw new Error("bonnet expect a function");
    }
    
    return function () {
        var args = arguments;
        return new Promise(function (resolve, reject) {
            var iterator = generator.apply(null, args);
            var result = {};

            function callNext() {
                Promise.resolve(result.value).then(function (value) {
                    result = iterator.next(value);
                    if (result.done) {
                        return resolve(result.value);
                    }
                    setImmediate(callNext);
                }).then(null, function (error) {
                    reject(error);
                });
            }
            callNext();
        });
    }
}

/**
 * bonnet construct.
 */
function bonnet(generator) {
    return wrap(generator)();
}

/**
 * is it promise
 */

function isThenable(obj) {
    return 'then' in obj && typeof obj.then === 'function';
}