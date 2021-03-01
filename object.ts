import { eqNumber } from 'fp-ts/Eq'
import { getLastSemigroup } from 'fp-ts/Semigroup'
import * as M from 'fp-ts/Map'
import * as R from 'fp-ts/Record'
import * as R1 from 'fp-ts-std/Record'
import * as Semi from 'fp-ts/Semigroup'
import {merge} from 'fp-ts-std/Record'
import * as _ from 'lodash'
import {withFallback} from 'io-ts-types/withFallback'
import * as t from 'io-ts'
import * as O from 'fp-ts/Option'
import * as O1 from 'fp-ts-std/Option'
import * as E1 from 'fp-ts-std/Either'
import { fromTraversable, Lens, Prism } from 'monocle-ts'
import * as P from 'monocle-ts/lib/Prism'
import * as Op from 'monocle-ts/lib/Optional'
import { array } from 'fp-ts/lib/Array'
import { indexArray } from 'monocle-ts/lib/Index/Array'
import * as A from 'fp-ts/Array'
import { pipe, identity } from 'fp-ts/lib/function'
import { fromNumber } from 'fp-ts-std/String'

const log = console.log

// _.assign
log(_.assign({a: 0, b: 2}, {a: 1, c: 3})) // this acutally mutates the object :(
log(merge({a: 0, b: 2})({a: 1, c: 3}))

// _.assignIn + _.assignInWith
// this is really a prototypical inheritance javascript thing, not a typescript thing


// _.assignWtih
// In general, the best way to merge records together is with a semigroup.
// The assignWith example code however is providing default values - something
// that can be done more easily with Options. We'll do both things here
// so that you can choose which one you need for your use case

// decode a random object, filling in defaults
// codecs are customizable, so you can put any codec you like here.
const ab = t.type({
  a: withFallback(t.number, 0),
  b: withFallback(t.number, 1)
})

// decoding a value is inherently something that can go wrong, so decode
// returns an Either. Eithers can be `right` which means we succeded in decoding
// or `left` which means we didn't succeed.
log(E1.unsafeUnwrap(ab.decode({})))  // generally a bad idea to unsafeUnwrap, but this is illustrative
log(ab.decode(1))                 // this fails because you can't decode a number to an object
log(ab.decode({a: 4, c: 12}))     // Defaults b, and keeps a and c. To strip values that aren't
                                  // in the codec, use `strict` instead of `type`.


// Semigroups are things that can be combined together.
interface optionAB{
  a?: number,
  b?: number,
  c?: number
}
// this is an implementation of a semigroup - it defines what happens
// when the `concat` function is called. In this case it will pick the 
// first value if its not undefined, otherwise it will return the second value.
const semiundef = {
  concat: <A>(x?: A, y?: A) => x !== undefined ? x : y
}

// get a semigroup instance that works with the optionAB interface
const semiAB = Semi.getStructSemigroup<optionAB>({
  a: semiundef,
  b: semiundef,
  c: semiundef
})
// now we can start smashing optionAB types together
log(semiAB.concat({a: 1}, {a: 2, b:2, c: 3}))
// { a: 1, b: 2, c: 3 }

// _.at

var object = { 'a': [{ 'b': { 'c': 3 } }, 4] } 
log(_.at(object, ['a[0].b.c', 'a[1]']))


// this implemtnation seems more complex than the lodash one - however,
// the lodash version has very little type information - getting 'undefined'
// generally means you've screwed something up, but what exactly?
// Using Lensing allows us to access nested properties in a composable and 
// typesafe way

// the prisim lets us select between the sum types
const j: P.Prism<{b: {c: number}} | number, number> = {
  getOption: (s) => (typeof s === "number") ? O.some(s) : O.some(s.b.c),
  reverseGet: identity,
}

const pp = (index: number) => pipe(
  Op.id<{ a: ReadonlyArray<{b: {c: number}} | number> }>(),
  Op.prop('a'),
  Op.index(index),
  Op.compose(P.asOptional(j)),
  a => a.getOption
)
log(A.compact([pp(0)(object), pp(1)(object)]))

// _.create - again, not really applicable to typescript

// _.defaults + _.defaultsDeep - see _.assignWith

// _.findKey
var users = {
  'barney':  { 'age': 36, 'active': true },
  'fred':    { 'age': 40, 'active': false },
  'pebbles': { 'age': 1,  'active': true }
};
 
log(_.findKey(users, function(o) { return o.age < 40; }))
//  => 'barney'

// filter all the records, grab the first key
log(pipe(users, R.filterWithIndex((k, v) => v.age < 40), R.keys, A.head))


// _.findLastKey
log(_.findLastKey(users, function(o) { return o.age < 40; }))

log(pipe(users, R.filterWithIndex((k, v) => v.age < 40), R.keys, A.last))

// _.forIn - this funciton is not really applicable for fp-ts
// you should either be transforming some data into other data
// or transforming data into IO - either way, you don't loop

// _.forInRight - see above

// _.forOwn - see above

// _.forOwnRight - see above

// _.functions - ??

// _.functionsIn - ??

// _.get
var obj = { 'a': [{ 'b': { 'c': 3 } }] }
log(_.get(object, 'a[0].b.c'))

// do it with lenses
const getC = pipe(
  Op.id<{ a: readonly { b: { c: number } }[] }>(),
  Op.prop('a'),
  Op.index(0),
  Op.prop('b'),
  opt => opt.getOption,
)
log(getC(obj))

// _.has
log(_.has(obj, 'a'))
log(pipe(R.lookup('a')(obj), O.isSome))

// with lensing for nested lookups
log(pipe(getC(obj), O.isSome))

// _.hasIn - see _.has

// _.invert
var obj1 = { 'a': 1, 'b': 2, 'c': 1 };
log(_.invert(obj1))

log(R1.invertLast(fromNumber)(obj1))

// _.invertBy
var obj2 = { 'a': 1, 'b': 2, 'c': 1 };
log(_.invertBy(obj2))
log(_.invertBy(obj2, function(value) {
  return 'group' + value;
}))

log(R1.invertAll(fromNumber)(obj2))
log(R1.invertAll(n => `group${n}`)(obj2))

// _.invoke

