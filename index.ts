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
import * as M from 'fp-ts/Monoid'
import * as IO from 'fp-ts/IO'
import * as Rand from 'fp-ts/Random'
import {getFirstSemigroup} from 'fp-ts/Semigroup'
import {pipe, identity, flow} from 'fp-ts/function'
import { lowerFirst } from 'lodash'

const log = console.log

//chunks
log(_.chunk([1,2,3], 2))
log(A.chunksOf(2)([1,2,3]))

//compact
log(_.compact([0, 1, false, 2, '', 3]))
log(A.filter(x => x ? true : false)([0, 1, false, 2, '', 3]))

log(A.compact([O.some(1), O.zero<number>()]))


//concat
log(_.concat([1,2,3], [4,5,6]))
log(A.getMonoid<number>().concat([1,2,3], [4,5,6]))

//difference
log(_.difference([2, 1], [2, 3]))
log(A.difference(Eq.eqNumber)([2, 1], [2, 3]))


//differenceBy
const eqFloor: Eq.Eq<number> = {
    equals: (x, y) => Math.floor(x) === Math.floor(y)
}

const eqProp: Eq.Eq<{x:number}> = {
    equals: (x, y) => x.x === y.x
}

log(_.differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor))
log(A.difference(eqFloor)([2.1, 1.2], [2.3, 3.4]))

//differenceby
log(_.differenceBy([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }], 'x'))
log(A.difference(eqProp)([{ 'x': 2 }, { 'x': 1 }], [{ 'x': 1 }]))

//differenceWith
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }]
 
log(_.differenceWith(objects, [{ 'x': 1, 'y': 2 }], _.isEqual))

const eq = Eq.getStructEq<{x:number, y:number}>({
  x: Eq.eqNumber,
  y: Eq.eqNumber
})
log(A.difference(eq)(objects, [{ 'x': 1, 'y': 2 }]))

//drop
log(_.drop([1, 2, 3], 2))
log(A.dropLeft(2)([1, 2, 3]))

//drop right
log(_.dropRight([1, 2, 3], 2))
log(A.dropRight(2)([1,2,3]))

//drop right while
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
log(_.dropRightWhile(users, function(o) { return !o.active; }))
log(pipe(users, A1.dropRightWhile((o) => !o.active)))

//drop while
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
log(_.dropWhile(users, function(o) { return !o.active; }))
log(pipe(users, A.dropLeftWhile((o) => !o.active)))

// fill
log(_.fill(Array(3), 2))
log(A.replicate(3,2))

//findindex
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
log(_.findIndex(users, function(o) { return o.user == 'barney'; }))
log(pipe(users, A.findIndex(o => o.user == 'barney'))) //returns an option

//findlastindex
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
log(_.findLastIndex(users, function(o) { return o.user == 'pebbles'; }))
log(pipe(users, A.findLastIndex(o => o.user == 'pebbles')))

//flatten
log(_.flatten([1, [2, [3, [4]], 5]]))
log(A.flatten([[1], [2, [3, [4]], 5]])) //actually typesafe

//flattendeep
//some recursive shit i guess

//flattendepth
//same as above

//from pairs
log(_.fromPairs([['a', 1], ['b', 2]]))
log(R.fromFoldable(getFirstSemigroup<number>(), A.Foldable)([['a', 1], ['b', 2]]))

//head
log(_.head([1, 2, 3]))
log(A.head([1, 2, 3])) // returns an option

//indexof
log(_.indexOf([1, 2, 1, 2], 2))
log(A.findIndex(n => n === 2)([1, 2, 1, 2])) // returns an option

//initial
log(_.initial([1, 2, 3]))
log(A.init([1, 2, 3])) // returns an option

//intersection
log(_.intersection([2, 1], [2, 3]))
log(pipe([2,1], A.intersection(Eq.eqNumber)([2,3])))

//intersectionby
log(_.intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor))
log(pipe([2.1, 1.2], A.intersection(eqFloor)([2.3, 3.4])))

//intersectionwith
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 
log(_.intersectionWith(objects, others, _.isEqual))
log(pipe(objects, A.intersection(eqProp)(others)))

//join
log(_.join(['a', 'b', 'c'], '-'))
log(A1.join('-')(['a', 'b', 'c']))

//last
log(_.last([1, 2, 3]))
log(A.last([1, 2, 3]))

// last index of
log(_.lastIndexOf([1, 2, 1, 2], 2))
log(pipe([1, 2, 1, 2], A.findLastIndex(n => n === 2)))

// nth
log(_.nth(['a', 'b', 'c', 'd'], 1))
log(A.lookup(1, ['a', 'b', 'c', 'd'])) // returns option

//pull
var array = ['a', 'b', 'c', 'a', 'b', 'c'];
 
log(_.pull(array, 'a', 'c'))
log(pipe(array, A.filter((a) => a !== 'a' && a !== 'c')))

//pullall
log(_.pullAll(array, ['a', 'c']))
log(pipe(array, A.filter((a) => a !== 'a' && a !== 'c')))

//pullallby
var arr = [{ 'x': 1 }, { 'x': 2 }, { 'x': 3 }, { 'x': 1 }];
 
log(_.pullAllBy(arr, [{ 'x': 1 }, { 'x': 3 }], 'x'))
log(pipe(arr, A.filter((a) => a.x !== 1 && a.x !== 3)))

//pullAllWith
var arr2 = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }, { 'x': 5, 'y': 6 }];
 
log(_.pullAllWith(arr2, [{ 'x': 3, 'y': 4 }], _.isEqual))
log(pipe(arr2, A.filter((a) => a.x !== 3 && a.y !== 4)))

//pullat
var arr3 = ['a', 'b', 'c', 'd'];
log(_.pullAt(arr3, [1, 3]))
var arr4 = ['a', 'b', 'c', 'd']
log(pipe([1,3], A.reduce([] as O.Option<string>[], (acc, n) => A.snoc(acc, A.lookup(n)(arr4))), A.compact ) )

//remove
var arr5 = [1, 2, 3, 4];
var evens = _.remove(arr5, function(n) {
  return n % 2 == 0;
})
log(evens)
log(arr5) // array was mutated in place :(
const arr6 = [1,2,3,4]

log(pipe(arr6, A.filter(n => n % 2 !== 0)))

//reverse
log(_.reverse([1,2,3]))
log(A.reverse([1,2,3]))

//slice
log(_.slice([1,2,3], 1, 2))
log(A1.slice(1)(2)([1,2,3]))

//sorteditems
log(_.sortedIndex([30, 50], 40))
log(pipe([30, 50], A.findIndex((x => x >= 40))))

//sortedindexby
var o1 = [{ 'x': 4 }, { 'x': 5 }];
log(_.sortedIndexBy(o1, { 'x': 4 }, function(o) { return o.x; }))
log(pipe(o1, A.findIndex((x => x.x >= 4))))

//sortedindexof
log(_.sortedIndexOf([4, 5, 5, 5, 6], 5))
log(A.findIndex(x => x === 5)([4, 5, 5, 5, 6]))

log(_.sortedLastIndex([4, 5, 5, 5, 6], 5))
log(pipe(A.findLastIndex(x => x === 5)([4, 5, 5, 5, 6]), O.map(x => x+1)))


//sortedLastIndexBy
var o2 = [{ 'x': 4 }, { 'x': 5 }];
log(_.sortedLastIndexBy(o2, { 'x': 4 }, function(o) { return o.x; }))
log(pipe(o2, A.findLastIndex(x => x.x === 4), O.map(x => x+1)))

//sortedLastIndexOf
log(_.sortedLastIndexOf([4, 5, 5, 5, 6], 5))
log(A.findLastIndex(x => x === 5)([4, 5, 5, 5, 6]))

//sortedUniq
log(_.sortedUniq([1, 1, 2]))
log(A.uniq(Eq.eqNumber)([1, 1, 2]))

//sortedUniqBy
log(_.sortedUniqBy([1.1, 1.2, 2.3, 2.4], Math.floor))
log(A.uniq(eqFloor)([1.1, 1.2, 2.3, 2.4]))

//tail
log(_.tail([1, 2, 3]))
log(A.tail([1, 2, 3]))

//take
log(_.take([1, 2, 3], 2))
log(A.takeLeft(2)([1,2,3]))

//takeright
log( _.takeRight([1, 2, 3], 2))
log(A.takeRight(2)([1,2,3]))

//takerightwhile
var users = [
  { 'user': 'barney',  'active': true },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': false }
];
 
log(_.takeRightWhile(users, function(o) { return !o.active; }))
log(pipe(users, A1.takeRightWhile(({active}) => !active)))

//takewhile
var users = [
  { 'user': 'barney',  'active': false },
  { 'user': 'fred',    'active': false },
  { 'user': 'pebbles', 'active': true }
];
 
log(_.takeWhile(users, function(o) { return !o.active; }))
log(pipe(users, A.takeLeftWhile(({active}) => !active)))

//union
log(_.union([2], [1, 2]))
log(A.union(Eq.eqNumber)([1,2])([2]))

//unionby
log(_.unionBy([2.1], [1.2, 2.3], Math.floor))
log(A.union(eqFloor)([1.2, 2.3])([2.1]))

//unionwith
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 
log(_.unionWith(objects, others, _.isEqual))
log(A.union(eq)(others)(objects))

//uniq
log(_.uniq([2, 1, 2]))
log(A.uniq(Eq.eqNumber)([2, 1, 2]))

//uniqby
log(_.uniqBy([2.1, 1.2, 2.3], Math.floor))
log(A.uniq(eqFloor)([2.1, 1.2, 2.3]))

//uniqwith
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }, { 'x': 1, 'y': 2 }];
 
log(_.uniqWith(objects, _.isEqual))
log(A.uniq(eq)(objects))

//unzip - only works with 2 tuples
var zipped : any[] = _.zip(['a', 'b'], [1, 2]);
log(zipped)
log(_.unzip(zipped)) //only works with 2 tuples not n tuples

//unzipwith - also only works with 2 tuples
var z1 = _.zip([1, 2], [10, 20]) as number[][];
// => [[1, 10], [2, 20]]
 
log(_.unzipWith(z1, _.add))
log(pipe(z1, A.reduce([0,0] as number[], (acc, n) => [acc[0] + n[0], acc[1] + n[1]])))


//without
log(_.without([2, 1, 2, 3], 1, 2))
log(A.filter(x => x !== 1 && x !== 2)([2,1,2,3]))

//xor
log(_.xor([2, 1], [2, 3]))
log(A1.symmetricDifference(Eq.eqNumber)([2,1])([2,3]))

//xorby
log(_.xorBy([2.1, 1.2], [2.3, 3.4], Math.floor))
log(A1.symmetricDifference(eqFloor)([2.1,1.2])([2.3,3.4]))

//xorwith
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 2, 'y': 1 }];
var others = [{ 'x': 1, 'y': 1 }, { 'x': 1, 'y': 2 }];
 
log(_.xorWith(objects, others, _.isEqual))
log(A1.symmetricDifference(eq)(objects)(others))

//zip - only works with 2 tuples
log(_.zip(['a', 'b'], [1, 2]))
log(A.zip(['a', 'b'], [1, 2]))

//zip object
log(_.zipObject(['a', 'b'], [1, 2]))
log(R.fromFoldableMap(getFirstSemigroup<number>(), A.array)(A.zip(['a', 'b'], [1, 2]), identity))

//zip object deep
log(_.zipObjectDeep(['a.b[0].c', 'a.b[1].d'], [1, 2]))
log(pipe(
  A.zipWith(['c', 'd'], [13, 30], (key, value) => ({[key]: value})),
  b => ({ a: { b } })
))

//zipwith
log(_.zipWith([1, 2], [10, 20], function(a, b) {
  return a + b;
}))

log(A.zipWith([1,2], [10, 20], M.monoidSum.concat))

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

//FUNCTIONS

