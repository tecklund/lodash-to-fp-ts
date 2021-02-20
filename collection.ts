import * as A from 'fp-ts/Array'
import * as Ap from 'fp-ts/Apply'
import * as A1 from 'fp-ts-std/Array'
import * as ROA from 'fp-ts/ReadonlyArray'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as O from 'fp-ts/Option'
import * as Eq from 'fp-ts/Eq'
import * as Ord from 'fp-ts/Ord'
import * as R from 'fp-ts/Record'
import * as _ from 'lodash'
import * as Map from 'fp-ts/Map'
import * as T from 'fp-ts/Task'
import * as M from 'fp-ts/Monoid'
import * as IO from 'fp-ts/IO'
import * as Rand from 'fp-ts/Random'
import {getFirstSemigroup} from 'fp-ts/Semigroup'
import {pipe, identity, flow} from 'fp-ts/function'
import { lowerFirst } from 'lodash'
import { task } from 'fp-ts/lib/Task'

const log = console.log



//count by
log(_.countBy([6.1, 4.2, 6.3], Math.floor))
// "magma" is how we combine things that are the same, in this case we sum them
// the keys are the floor of the values in the array, and we're adding one every time we see another
log(R.fromFoldableMap(M.monoidSum, A.array)([6.1, 4.2, 6.3], (n) => [Math.floor(n).toString(), 1]))

//every
var u1 = [
  { 'user': 'barney', 'age': 36, 'active': false },
  { 'user': 'fred',   'age': 40, 'active': false }
];

log(_.every(u1, { 'user': 'barney', 'active': false }))
log(pipe(u1, A.every(u => u.user === 'barney' && !u.active)))

//filter
var u2 = [
  { 'user': 'barney', 'age': 36, 'active': true },
  { 'user': 'fred',   'age': 40, 'active': false }
];
 
log(_.filter(u2, function(o) { return !o.active; }))
log(pipe(u2, A.filter(({active}) => !active)))

//find
var u3 = [
  { 'user': 'barney',  'age': 36, 'active': true },
  { 'user': 'fred',    'age': 40, 'active': false },
  { 'user': 'pebbles', 'age': 1,  'active': true }
];
 
log(_.find(u3, function(o) { return o.age < 40; }))
log(pipe(u3, A.findFirst(({age}) => age < 40))) //returns an option

//findLast
log(_.findLast([1, 2, 3, 4], function(n) {
  return n % 2 == 1;
}))
log(pipe([1,2,3,4], A.findLast(n => n % 2 === 1)))

//flatmap
const duplicate = <A>(n:A) => [n, n]
 
log(_.flatMap([1, 2], duplicate))
log(A.chain(duplicate)([1,2]))

//flatmapdeep
const duplicate2 = <A>(n:A) => [[n, n]]
log(_.flatMapDeep([1, 2], duplicate2))
log(pipe([1,2], A.chain(duplicate2), A.flatten))

//flatmapdepth
//doesn't really makes sense, you flatten as many times as you like
const duplicate3 = <A>(n:A) => [[[n, n]]]
log(_.flatMapDepth([1, 2], duplicate3, 2))
log(pipe([1,2], A.chain(duplicate3), A.flatten))

//foreach
// performs side effects, doesn't return a value
_.forEach([1, 2], function(value) {
  console.log(value);
});

// IO really just means a function that takes no input and returns a result.
// what we have here is a function that takes an A and returns an IO
const log2 = <A>(a:A) => () => console.log(a)
// IO means do something with side effects, like log to the console
// theese two implementations do the same thing, but in slightly different ways

// run an action for each element in an array and return the results
log(pipe([1,2], IO.traverseArray(log2))())
// transform an array of IO into an IO of array
log(pipe([1,2], A.map(log2), IO.sequenceArray)())

//forEachRight
_.forEachRight([1, 2], function(value) {
  console.log(value);
});

log(pipe([1,2], A.reverse, IO.traverseArray(log2))())

//groupby
log(_.groupBy([6.1, 4.2, 6.3], Math.floor))
log(R.fromFoldableMap(A.getMonoid<number>(), A.array)([6.1, 4.2, 6.3], n => [Math.floor(n).toString(), [n]]))

//includes
log(_.includes([1, 2, 3], 1))
log(A.some(x => x === 1)([1,2,3]))

//invokemap
log(_.invokeMap([[5, 1, 7], [3, 2, 1]], 'sort'))
log(pipe(([[5, 1, 7], [3, 2, 1]]), A.map(A.sort(Ord.ordNumber))))

//keyby
var arr7 = [
  { 'dir': 'left', 'code': 97 },
  { 'dir': 'right', 'code': 100 }
];
 
log(_.keyBy(arr7, function(o) {
  return String.fromCharCode(o.code);
}))

log(R.fromFoldableMap(getFirstSemigroup<{dir:string, code:number}>(), A.array)
   (arr7, (o) => [String.fromCharCode(o.code), o]))


//map
log(_.map([4,8], x => x * x))
log(pipe([4,8], A.map(x => x * x)))

//orderby
var u4 = [
  { 'user': 'fred',   'age': 48 },
  { 'user': 'barney', 'age': 34 },
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 36 }
];

interface Person {
  user: string
  age: number
}
const byName = Ord.ord.contramap(Ord.ordString, (p: Person) => p.user)
const byAge = Ord.ord.contramap(Ord.getDualOrd(Ord.ordNumber), (p: Person) => p.age)
 
// Sort by `user` in ascending order and by `age` in descending order.
log(_.orderBy(u4, ['user', 'age'], ['asc', 'desc']))
log(A.sortBy([byName, byAge])(u4))

var u7 = [
  { 'user': 'barney',  'age': 36, 'active': false },
  { 'user': 'fred',    'age': 40, 'active': true },
  { 'user': 'pebbles', 'age': 1,  'active': false }
];
 
log(_.partition(u7, function(o) { return o.active; }))
log(pipe(u7, A.partition(({active}) => active)))

//reduce
log(_.reduce([1, 2, 3], function(sum, n) {
  return sum + n;
}, 0))
log(A.reduce(0, M.monoidSum.concat)([1,2,3]))

//reduceright
var arr8 = [[0, 1], [2, 3], [4, 5]];
 
log(_.reduceRight(arr8, function(flattened:number[], other) {
  return flattened.concat(other);
}, []))

log(pipe(arr8, A.reduceRight([] as number[], (n, acc) => acc.concat(n))))
//note that the order of the params is revered compared to standard reduce
log(pipe(arr8, A.reduce([] as number[], (acc, n) => acc.concat(n))))

//reject
var u8 = [
  { 'user': 'barney', 'age': 36, 'active': false },
  { 'user': 'fred',   'age': 40, 'active': true }
];
 
log(_.reject(u8, function(o) { return !o.active; }))

log(pipe(u8, A1.reject(({active}) => !active)))

//sample
log(_.sample([1, 2, 3, 4]))
const arr9 = ['a', 'b', 'c', 'd']
log(pipe(Rand.randomInt(0, arr9.length-1), IO.map(x => arr9[x]))())

//shuffle
log(_.shuffle([1, 2, 3, 4]))

interface shuf<A> {
  sort: number
  val: A
}
const bysort = (<A>() => Ord.ord.contramap(Ord.ordNumber, (p: shuf<A>) => p.sort))()

// this really needs to take a seed in the future for better testing
const fpshuffle = <A>(arr: A[]) => 
  pipe(
    A.replicate(arr.length, Rand.random), 
    IO.sequenceArray, 
    IO.map(flow(
      ROA.zip(arr), 
      ROA.map(([sort, val]) => ({sort, val})), 
      ROA.sort(bysort), 
      ROA.map(x => x.val)
    ))
  )

log(fpshuffle(arr9)())

//samplesize - needs shuffle to work so its down here
log(pipe(fpshuffle(arr9), IO.map(ROA.takeLeft(2)))())

//size
log(_.size({a: 1, b: 2}))
log(R.size({a: 1, b: 2}))

//some
var users = [
  { 'user': 'barney', 'active': true },
  { 'user': 'fred',   'active': false }
];
 
log(_.some(users, { 'user': 'barney', 'active': false }))
const userEq: Eq.Eq<{user:string, active:boolean}> = {
  equals: (x,y) => x.user === y.user && x.active === y.active
}
log(pipe(users, A.some(x => userEq.equals(x, { 'user': 'barney', 'active': false }))))


//sortby
var u9 = [
  { 'user': 'fred',   'age': 48 },
  { 'user': 'barney', 'age': 36 },
  { 'user': 'fred',   'age': 40 },
  { 'user': 'barney', 'age': 34 }
];
 
log(_.sortBy(u9, [function(o) { return o.user; }]))

log(A.sort(byName)(u9))



