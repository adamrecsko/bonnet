# bonnet
Bonnet is a simple tool for distributing your long running blocking tasks in time using ES6 generators in [node](http://nodejs.org/).

Using Bonnet you are able to split your computation into pieces with yield and in the end return your result.
Bonnet returns a promise and resolves it, if your function finished or rejects it, if you throw an error. 
The benefit of this is that you won't block your event loop if you are working on small fast parts.

## Installation

```
$ npm install bonnet
```
And after:

```javascript
var bonnet = require('bonnet');
bonnet(myGenerator);

```

## How to use

### Simple example

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


### Combine with promises

```javascript
var bonnet = require('bonnet');
var Promise = require('promise');


function myAsynchronousTask() {
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve("bar");
        }, 10);
    });
}

bonnet(function* () {
    var result = "foo";
    result += yield myAsynchronousTask();
    result += yield "foo";
    return result;
}).then(function (data) {
    console.log(data); //foobarfoo
});

```


### Error handling

```javascript
var bonnet = require('bonnet');
bonnet(function* () {
    var somethingWrong = true;
    if(somethingWrong){
       throw new Error("ERROR");
    }  
}).then(null, function (error) {
    console.log(error);
});

```


### Wrapper

```javascript
var wrap = require('bonnet').wrap;
var wrappedFunction = wrap(function* (a,b) {
      var str = "";
      for (var i=0; i<=10000; i++){
        str =  yield (new Array(5)).join(b);
      }
      return a+str;
});

wrappedFunction("foo","bar").then(function(data){
    console.log(data);  //foobarbarbarbar
});

```

## Test
```
  $ npm test
```


