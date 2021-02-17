import * as A from 'fp-ts/Array'
import * as O from 'fp-ts/Option'
import * as Eq from 'fp-ts/Eq'
import * as _ from 'lodash'

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

