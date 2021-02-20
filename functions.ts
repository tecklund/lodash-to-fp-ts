import * as _ from 'lodash'
import { from } from 'rxjs'
import { finalize, mergeAll, tap, windowCount, map } from 'rxjs/operators'
import {pipe, identity, tuple, flow} from 'fp-ts/function'
import * as Ob from 'fp-ts-rxjs/Observable'
import * as S from 'fp-ts/State'
import * as IO from 'fp-ts/IO'
import * as A from 'fp-ts/Array'


const log = console.log

var saves = ['profile', 'settings', 's', 'd'];

['profile', 'settings', 's', 'd']

const doAfter = (prefix:string) => () => log(`${prefix} do after`)

const asyncSave = ({type, complete} : {type:string, complete: () => void}) => done()
// starts invoking on the third call
var done = _.after(3, doAfter("lodash"));
 
_.forEach(saves, function(type) {
  asyncSave({ 'type': type, 'complete': done });
});


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

