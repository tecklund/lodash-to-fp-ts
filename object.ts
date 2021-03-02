import { eqNumber, eqString } from 'fp-ts/Eq'
import { getLastSemigroup } from 'fp-ts/Semigroup'
import * as M from 'fp-ts/Map'
import * as R from 'fp-ts/Record'
import * as R1 from 'fp-ts-std/Record'
import * as Semi from 'fp-ts/Semigroup'
import * as Mon from 'fp-ts/Monoid'
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
import { indexArray } from 'monocle-ts/lib/Index/Array'
import * as A from 'fp-ts/Array'
import { pipe, identity, flow } from 'fp-ts/lib/function'
import { fromNumber } from 'fp-ts-std/String'
import * as TH from 'fp-ts/These'
import * as ROA from 'fp-ts/ReadonlyArray'
import { Do } from 'fp-ts-contrib/lib/Do'
import { ADT, match, matchI } from "ts-adt"
import * as Eq from 'fp-ts/Eq'
import * as NEA from 'fp-ts/NonEmptyArray'

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

// _.invoke - this is just a terrible idea :/
// you can use lensing to get the property you want and then invoke it

// _.keys
log(_.keys({'a': 1, 'b':2}))
log(R.keys({'a': 1, 'b':2}))

// _.keysIn - see keys

// _.mapKeys
log(_.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
  return key + value;
}))
log(pipe({ 'a': 1, 'b': 2 }, R.reduceWithIndex({}, (k, acc, v) => ({...acc, [k+v]: v}))))

// _.mapValues
log(_.mapValues({ 'a': 1, 'b': 2 }, (v) => v+1))
log(pipe({ 'a': 1, 'b': 2 }, R.map(v => v+1)))

// _.merge -- this is nasty, it will just drop values if it doesn't get what it expects
// please don't use the lodash merge, it will lead to subtle bugs :(
var obj3 = {
  'a': [{ 'b': 2 }, { 'd': 4 }, {'f': 6}, {'g': 3}]
};

// this is not typesafe, you can see a 5 in there
var other = {
  'a': [{ 'c': 3 }, { 'e': 5 }, {'f': 12}, 5]
};

// gives a bad answer, just drops {g: 3} >:|
log(_.merge(obj3, other))


type nested = Record<string, Record<string, number>[]>
var obj4: nested = {
  'a': [{ 'b': 2 }, { 'd': 4 }, {'f': 6}, {'g': 3}]
};
 
var other2: nested = {
  'a': [{ 'c': 3 }, { 'e': 5 }, {'f': 12}]
};

// ok so i wanted to zip uneven lists but this doesn't exist in fp-ts (yet!) so i just made it real quick
// it uses options to tell you if one side or the other isn't there
const zipWithAll = <A, B, C>(
  fa: ReadonlyArray<A>, 
  fb: ReadonlyArray<B>, 
  f: (a: O.Option<A>, b: O.Option<B>) => C): ReadonlyArray<C> => {
  const fc: Array<C> = []
  const len = Math.max(fa.length, fb.length)
  for (let i = 0; i < len; i++) {
    fc[i] = f(i < fa.length ? O.some(fa[i]) : O.none, i < fb.length ? O.some(fb[i]) : O.none)
  }
  return fc
}

// zip but just gives arrays of size 1 when its uneven
const zipAll = <A, B, C>(fa: ReadonlyArray<A>, fb: ReadonlyArray<B>) =>
  zipWithAll(fa, fb, (a, b) => A.compact<(A|B)>([a, b]))

// merge two records together - if there is a collision take the first one
const mergeDict = R.getMonoid<string, number>(Semi.getLastSemigroup<number>()).concat
// convienience func for concating arrays together
const concat = <A>(a:A[]) => (b:A[]) => A.getMonoid<A>().concat(a, b)

// an instance of semigroup for the nested type
const nestedSemigroup = {
  concat: (x: nested, y: nested) : nested => {
    const keys = pipe(R.keys(x), concat(R.keys(y)), A.uniq(eqString))
    return pipe(keys, A.reduce({}, (acc, k) => {
      const left = R.lookup(k)(x)
      const right = R.lookup(k)(y)
      if(O.isNone(left) && O.isSome(right)) return {...acc, [k] : O1.unsafeUnwrap(right)}
      if(O.isSome(left) && O.isNone(right)) return {...acc, [k] : O1.unsafeUnwrap(left)}
      // we know they must both have hit
      const mergedItems = pipe(
        zipAll(O1.unsafeUnwrap(left), O1.unsafeUnwrap(right)), 
        ROA.map(A.reduce({} as Record<string, number>, mergeDict))
      )
      return {...acc, [k]: mergedItems}
    }))
  }
}

const shareKeys: Eq.Eq<Record<string, unknown>> = pipe(
  Eq.fromEquals(flow(A.intersection(Eq.eqString), A.isNonEmpty)),
  Eq.contramap(R.keys),
)
const mergeRecord = R.getMonoid(Semi.getLastSemigroup<number>())

const nestedSemigroup2 = R.getMonoid<string, Record<string, number>[]>({
  concat: (a, b) => pipe(
    [...a, ...b],
    NEA.group(shareKeys),
    A.map(Mon.fold(mergeRecord))
  ),
})

// this gives you the correct answer without undefined behavior
log(nestedSemigroup.concat(obj4, other2))


