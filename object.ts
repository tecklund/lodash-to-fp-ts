import { eqNumber } from 'fp-ts/Eq'
import { getLastSemigroup } from 'fp-ts/Semigroup'
import * as M from 'fp-ts/Map'
import * as R from 'fp-ts/Record'
import * as Semi from 'fp-ts/Semigroup'
import {merge} from 'fp-ts-std/Record'
import * as _ from 'lodash'
import {withFallback} from 'io-ts-types/withFallback'
import * as t from 'io-ts'
import * as O from 'fp-ts/Option'
import * as O1 from 'fp-ts-std/Option'
import * as E1 from 'fp-ts-std/Either'
import { fromTraversable, Lens, Prism } from 'monocle-ts'
import { array } from 'fp-ts/lib/Array'
import { indexArray } from 'monocle-ts/lib/Index/Array'
import * as A from 'fp-ts/Array'
import { pipe } from 'fp-ts/lib/function'

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
interface demoObject{
  a: ({b: {c: number}} | number)[]
}
// access a specific item in an array
const fst = indexArray<{b: {c: number}} | number>().index(0)
const sec = indexArray<{b: {c: number}} | number>().index(1)

// create a Lens for accessing the 'a' property
const a = Lens.fromProp<demoObject>()('a')

// create a Prism for getting either the number or the path you want
const cornum : Prism<{b: {c: number}} | number, number> = new Prism(
  (s) => (typeof s === "number") ? O.some(s) : O.some(s.b.c),
  (a) => a
)
// get the first and second values
const fstval = a.composeOptional(fst).composePrism(cornum).getOption(object)
const secval = a.composeOptional(sec).composePrism(cornum).getOption(object)

// turn an array of options into a flat array with nones removed
log(A.compact([fstval, secval]))
