import * as _ from 'lodash'
import { from, of, timer } from 'rxjs'
import { take, debounceTime, finalize, skip, throttleTime} from 'rxjs/operators'
import {pipe, flip, tuple, flow} from 'fp-ts/function'
import * as Ob from 'fp-ts-rxjs/Observable'
import * as O from 'fp-ts/Option'
import * as S from 'fp-ts/State'
import * as IO from 'fp-ts/IO'
import * as A from 'fp-ts/Array'
import * as A1 from 'fp-ts-std/Array'
import * as T from 'fp-ts/Task'
import * as C from 'fp-ts/Console'
import {memoize, curry2, curry3} from 'fp-ts-std/Function'
import * as F1 from 'fp-ts-std/Function'
import { eqNumber } from 'fp-ts/lib/Eq'
import { lowerFirst } from 'lodash'

const log = console.log


// after
var saves = ['profile', 'settings', 's', 'd'];

['profile', 'settings', 's', 'd']

const doAfter = (prefix:string) => () => log(`${prefix} do after`)

const asyncSave = ({type, complete} : {type:string, complete: () => void}) => done()
// starts invoking on the third call
var done = _.after(3, doAfter("lodash"));
 
_.forEach(saves, function(type) {
  asyncSave({ 'type': type, 'complete': done });
});

// multiple solutions depending on what you'd like to achieve

// #1 - track counts 

// In FP we don't mutate state, so that we can write tests more easily.
// instead we keep a running count so that we can feed how many have been
// executed into the call
// since logging is an IO thing we also don't do it inline, but at the end
const myio = IO.fromIO(doAfter("fp-ts")) //whatever IO you want to do
const initialState = (count: number) => tuple([], count)
const invokeAfter = (after: number) => (s: IO.IO<void>[]) => (count: number) => 
  count >= after ? tuple(A.cons(myio)(s), count+1) : tuple(s, count+1)

// invokes on the third call
const invokeAfter2 = invokeAfter(2)

pipe(
  initialState,
  S.chain(invokeAfter2),
  S.chain(invokeAfter2),
  S.chain(invokeAfter2),
  S.chain(invokeAfter2),
  S.evaluate(0),
  IO.sequenceArray
)()

// #2 use finalize to do something at the end of your calls

pipe(
  from(saves),
  finalize(() => log('save complete'))
).subscribe()

// #3 use skip to make sure you invoke your function after x events

pipe(
  from(saves),
  skip(2),
  Ob.chain(() => pipe(C.log('fp-ts do after'), Ob.fromIO))
).subscribe()

// ary - honestly this one is wierd for typescript, hard to imagine it being used

//before - invokes the function before it is called n times
const b4 = _.before(2, () => console.log("before stopping"))
_.forEach([1,2,3,4,5], b4)

// really you should use streams for this - take will only allow x items from your stream
const stream = from([1,2,3,4,5])
pipe(stream, take(1)).subscribe(log)


// bind - this is what currying is for
const greet = (greeting:string) => (punc:string) => (user:string) =>
  `${greeting} ${user}${punc}`

const hellogreeting = greet("hi")("!")
log(hellogreeting("fred"))


// curry
var abc = function(a:number, b:number, c:number) {
  return [a, b, c];
};
 
log(_.curry(abc)(1)(2)(3))
log(curry3(abc)(1)(2)(3))



// debounce
//emit four strings
const example = of('WAIT', 'ONE', 'SECOND', 'Last will display');
// emit only once ever second, tales the last value
pipe(example, debounceTime(1000)).subscribe(log)


// defer
_.defer(function(text) {
  console.log(text);
}, 'deferred 1');

// using IO
pipe(T.delay(0)(T.of("defferred 1")), T.chain(flow(C.log, T.fromIO)))()
// not using IO
pipe(T.delay(0)(T.of("defferred 2")))().then(log)


// flip
var flipped = _.flip(function(...a) {
  return _.toArray(a);
});
 
log(flipped('a', 'b', 'c', 'd'))
// => ['d', 'c', 'b', 'a']

log(flip((a, b) => [a, b])(1, 2))

//memoize
const foo = (x:number) => {
  log("calling foo")
  return x;
}
var mfoo = _.memoize(foo);
log(mfoo(3))
log(mfoo(3))

const fpmem = memoize(eqNumber)(foo)
log(fpmem(3))
log(fpmem(3))

// negate
const isEven = (n: number) => n % 2 == 0
 
log(_.filter([1, 2, 3, 4, 5, 6], _.negate(isEven)))

const negate = <A>(f:(a:A)=>boolean) => (a:A) => !f(a)
const notEven = negate(isEven)
log(pipe([1, 2, 3, 4, 5, 6], A.filter(notEven)))


// once - as with after and before, we have an issue of state
// see the stateful implementation of after for an idea of
// how to mainain state. Or, use streams which are also nice.

// overargs

const doubled = (n:number) => n * 2 
const square = (n:number) => n * n

// no typing info :(
var func = _.overArgs(function(x, y) {
  return [x, y];
}, [square, doubled]);
 
log(func(9, 3))
// => [81, 6]


// honestly this is very silly - you can easily apply whatever 
// functions to your params before passing them into your other functions
const doargs = <A>(funcs: ((a:A) => A)[]) => (args:A[]) =>
  pipe(args, A.zip(funcs), A.map(([a, f]) => f(a)))
const args = doargs([square, doubled])
const func2 = (x?:number, y?:number) => [x, y]
log(func2(...args([9, 3])))
// => [81, 6]

// for real, you can just do this
const withFancyParams = (x:number, y:number) => tuple(square(x), doubled(y))
log(withFancyParams(9,3))
// => [81, 6]


// partial
function greet2(greeting:string, name:string) {
  return greeting + ' ' + name;
}
 
var sayHelloTo = _.partial(greet2, 'hello');
log(sayHelloTo('fred'))

const greet3 = curry2(greet2)('hello')
log(greet3('fred'))

// partialRight 
var greetFred = _.partialRight(greet2, 'fred');
log(greetFred('hi'))

const greet4 = F1.flip(curry2(greet2))('fred')
log(greet4('hi'))


//rearged - this function is madness, why would you ever do this


//rest - the lodash version isn't typesafe, please don't use it
var say = _.rest(function(what:string, names:string) {
  return what + ' ' + _.initial(names).join(', ') +
    (_.size(names) > 1 ? ', & ' : '') + _.last(names);
});
 
log(say('hello', 'fred', 'barney', 'pebbles'))

const say2 = (what:string, ...names:string[]) =>
  `${what} ${pipe(names, 
    A.init, 
    O.map(A1.join(", ")), 
    O.getOrElse(() => ''))
  }${names.length > 1 ? ', & ' : ''}${O.getOrElse(() => '')(A.last(names))}`
log(say2('hello', 'fred', 'barney', 'pebbles'))

// spread - lodash version of spread is also not typesafe, please don't use
var say3 = _.spread(function(who, what) {
  return who + ' says ' + what;
});
 
log(say3(['fred', 'hello']))
const say4 = (who?:string, what?:string) => `${who} says ${what}`
log(say4(...['fred', 'hello']))


// throttle
const throttleExample = of('First will display', 'ONE', 'SECOND', 'Last will not display');
// emit only once ever second, tales the last value
pipe(throttleExample, throttleTime(1000)).subscribe(log)


//unary
log(_.map(['1', '2', '3'], _.unary(_.parseInt)))

// unary from lodash is basically useless, but unary in
// fp-ts works slightly differently and can be useful. It translates
// a function that takes a variadic number of args into taking an array instead
log(F1.unary(Math.max)([1,2,3]))

//wrap
var p = _.wrap(_.escape, function(func, text:string) {
  return '<p>' + func(text) + '</p>';
});
 
log(p('fred, barney, & pebbles'))

const p1 = (f: (s:string) => string) => (text:string) => `<p>${f(text)}</p>`

// escaping html isn't really what fp-ts is for, but you can do it like this
//https://stackoverflow.com/a/20403618/1748268
const escapeHTML = (s:string) =>
  s.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');


log(p1(escapeHTML)('fred, barney, & pebbles'))


