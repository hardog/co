'use strict';

const co = require('./index');
const assert = require('assert');

// // 向co传递一个函数
// Promise.resolve()
// .then(() => co(function(){
//     return 'from co fn';
// }))
// .then((r) => {
//     assert.equal(r, 'from co fn', 'should equal');
// })
// .catch((e) => console.log('error', e));


// // 向co传递一个生成器
// function *a1(){
//     console.log('enter a1');
//     yield [];
// }

// Promise.resolve()
// .then(() => co(function *(){
//     yield a1();
//     return 'from co fn';
//     // don't execute
//     yield [1];
// }))
// .then((r) => {
//     assert.equal(r, 'from co fn', 'should equal');
// })
// .catch((e) => console.log('error', e));


// // 向co传递一个生成器
// function wait(ms){
//     return function(done){
//         setTimeout(() => done(), ms || 0);
//     };
// }

// Promise.resolve()
// .then(() => co(function *(){
//     yield wait(1);
// }))
// .then((r) => {
//     assert.equal(r, undefined, 'yield over get undefined');
// })
// .catch((e) => console.log('error', e));


// // 从onRejected抛出错误
// Promise.resolve()
// .then(() => co(function *(){
//     try{
//         yield new Promise((resolve, reject) => {
//             reject('error');
//         });
//     }catch(e){
//         console.log('err catched, from co onRejected 抛错');
//     }
// }))
// .catch((e) => {
//     assert.equal(e, 'error', 'reject to error');
// });

// // 上一个Promise throw Error
// // 被下一个Promise的reject接收到
// Promise.resolve()
// .then(() => {
//     throw new Error('xx');
// })
// .then(()  => {
//     console.log('reolve');
// }, () => {
//     console.log('reject');
// })
// .catch(() => console.log('catch'));


// // gg.next(passed) passed值为
// // 上一次yield 的返回值即a(a = yield [xx])
// // .next 返回yield 后面执行后的值
// // .next(p) 参数p为上一次yield的返回值即a(a = yield [xx])
// function *ga(){
//     console.log('enter ga');
//     yield 'ga';
// }

// function *g(){
//     console.log('enter')
//     var ret = yield [];
//     console.log('ret', ret);
//     var s = yield 'hello';
//     console.log('s', s);
//     var g = yield ga();
//     console.log('g', g);
// }

// let gg = g();
// console.log(gg.next('undefined'));
// console.log(gg.next('ret passed'));
// console.log(gg.next('s passed'));
// console.log(gg.next('g passed'));
