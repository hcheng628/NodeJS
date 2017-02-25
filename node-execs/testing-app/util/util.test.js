const util = require('./util');
var expect = require('expect');

var addRes = util.add(3,3);
expect(addRes).toBe(6).toBeA('number');

var squareRes = util.square(3);
expect(squareRes).toBe(9).toNotBeA('string');

it('asynAdd 3 + 3', (done)=>{
    util.asynAdd(3,3, (callback) =>{
        expect(callback).toBe(6).toBeA('number');
        done();
    });
});

it('asynSquare 3 * 3',(donedone)=>{
    util.asynSquare(3,(callback)=>{
        expect(callback).toBe(9).toBeA('number');
        donedone();
    });
})
