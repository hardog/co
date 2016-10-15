'use strict';

const co = require('./index');
const assert = require('assert');

// 向co传递一个函数
Promise.resolve()
.then(() => co(function(){
    return 'from co fn';
}))
.then((r) => {
    assert.equal(r, 'from co fn', 'should equal');
})
.catch((e) => console.log('error', e));


// 向co传递一个生成器
function wait(ms){
    return function(done){
        setTimeout(() => done(), ms || 0);
    };
}

Promise.resolve()
.then(() => co(function *(){
    yield wait(1);
}))
.then((r) => {
    assert.equal(r, undefined, 'yield over get undefined');
})
.catch((e) => console.log('error', e));


// 从onRejected抛出错误
Promise.resolve()
.then(() => co(function *(){
    try{
        yield new Promise((resolve, reject) => {
            reject('error');
        });
    }catch(e){
        console.log('err catched, from co onRejected 抛错');
    }
}))
.catch((e) => {
    assert.equal(e, 'error', 'reject to error');
});

// 上一个Promise throw Error
// 被下一个Promise的reject接收到
Promise.resolve()
.then(() => {
    throw new Error('xx');
})
.then(()  => {
    console.log('reolve');
}, () => {
    console.log('reject');
})
.catch(() => console.log('catch'));
