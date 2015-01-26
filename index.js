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
                try {
                    result = iterator.next(result.value);
                } catch (error) {
                    return reject(error);
                }
                if (result.done) return resolve(result.value);
                setImmediate(callNext);
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