
/**
 * slice() reference.
 */

var slice = Array.prototype.slice;

/**
 * Expose `co`.
 */

module.exports = co['default'] = co.co = co;

/**
 * 将生成器包装成Promise函数
 */

co.wrap = function (fn) {
  createPromise.__generatorFunction__ = fn;
  return createPromise;
  function createPromise() {
    return co.call(this, fn.apply(this, arguments));
  }
};

/**
 * 执行生成器函数或者生成器
 */

function co(gen) {
  var ctx = this;
  // 除了第一个参数, 其他参数传进中间件gen
  var args = slice.call(arguments, 1);

  return new Promise(function(resolve, reject) {
    // 如果是函数直接执行function(){}/function *(){}
    if (typeof gen === 'function') gen = gen.apply(ctx, args);
    // 如果不是生成器函数直接返回
    if (!gen || typeof gen.next !== 'function') return resolve(gen);

    onFulfilled();

    // 执行函数体
    // 执行第一个yield时如果抛出错误将直接返回
    function onFulfilled(res) {

      var ret;
      try {
        ret = gen.next(res);
      } catch (e) {
        return reject(e);
      }

      next(ret);
      return null;
    }

    // yield过程中如果出现错误
    // 大部分错误通过这个捕获
    function onRejected(err) {
      var ret;
      try {
        ret = gen.throw(err);
      } catch (e) {
        return reject(e);
      }
      next(ret);
    }

    // 接收上次 yield 的值
    function next(ret) {
      console.log('ret', ret)
      if (ret.done) return resolve(ret.value);
      var value = toPromise.call(ctx, ret.value);

      // 最后生成的值都是转换成Promise, 执行后返回的
      if (value && isPromise(value)) return value.then(onFulfilled, onRejected);
      // 只允许yield 函数, Promise, 生成器, 数组, 对象
      return onRejected(new TypeError('You may only yield a function, promise, generator, array, or object, '
        + 'but the following object was passed: "' + String(ret.value) + '"'));
    }
  });
}


// 将生成器函数, 函数, 数组, 对象转换成Promise对象
// 原始值如1, 'hello'是不会转成Promise的
function toPromise(obj) {
  if (!obj) return obj;
  if (isPromise(obj)) return obj;
  if (isGeneratorFunction(obj) || isGenerator(obj)) return co.call(this, obj);
  if ('function' == typeof obj) return thunkToPromise.call(this, obj);
  if (Array.isArray(obj)) return arrayToPromise.call(this, obj);
  if (isObject(obj)) return objectToPromise.call(this, obj);
  return obj;
}


// 将一个函数转换成Promise 带有done 回调参数
// 即yield function(done){}
function thunkToPromise(fn) {
  var ctx = this;
  return new Promise(function (resolve, reject) {
    fn.call(ctx, function (err, res) {
      if (err) return reject(err);
      if (arguments.length > 2) res = slice.call(arguments, 1);
      resolve(res);
    });
  });
}

// 将数组转换成Promise
function arrayToPromise(obj) {
  return Promise.all(obj.map(toPromise, this));
}


// 根据对象的key, 将每一个对象的值都转化成Promise对象
function objectToPromise(obj){
  var results = new obj.constructor();
  var keys = Object.keys(obj);
  var promises = [];
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var promise = toPromise.call(this, obj[key]);
    if (promise && isPromise(promise)) defer(promise, key);
    else results[key] = obj[key];
  }
  return Promise.all(promises).then(function () {
    return results;
  });

  function defer(promise, key) {
    // predefine the key in the result
    results[key] = undefined;
    promises.push(promise.then(function (res) {
      results[key] = res;
    }));
  }
}

// 检查对象是否是Promise
function isPromise(obj) {
  return 'function' == typeof obj.then;
}

// 检查对象是否是生成器 
// 生成器函数: g = function *(){}
// 生成器: gg = g();
function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}

// 检查是否是生成器函数 
function isGeneratorFunction(obj) {
  var constructor = obj.constructor;
  if (!constructor) return false;
  // chrome 53浏览器中生成器构造函数有 name 属性
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}

// 检查val是否是对象
function isObject(val) {
  return Object == val.constructor;
}
