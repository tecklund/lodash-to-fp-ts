import * as _ from 'lodash'
import { from, of, timer } from 'rxjs'
import { take, debounceTime, finalize, skip} from 'rxjs/operators'
import {pipe, flip, tuple, flow} from 'fp-ts/function'
import * as Ob from 'fp-ts-rxjs/Observable'
import * as S from 'fp-ts/State'
import * as IO from 'fp-ts/IO'
import * as A from 'fp-ts/Array'
import * as T from 'fp-ts/Task'
import * as C from 'fp-ts/Console'

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
// the curry function isn't typesafe and is not supported
// https://github.com/gcanti/fp-ts/issues/951#issuecomment-573332860

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

