# bonnet

Bonnet is a simple tool for distribute your long running blocking tasks in time using ES6 generators.

```javascript
var bonnet = require('bonnet');
bonnet(function* () {
     var sum = 0;
     for (var i = 0; i <= 10000; i++) {
            yield sum = sum + i;
     }
     return sum;
}).then(function (data) {
    console.log(data);
}, function (error) {
    console.log(error);
});

```