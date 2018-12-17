organization
  => project(s)
    => cluster(s)
      => database(s)
        => collection(s)
          => document(s)
            => field(s)


## [MongoClient](http://mongodb.github.io/node-mongodb-native/3.1/api/MongoClient.html)
```js
const MongoClient = require('mongodb').MongoClient
```
### Connect to MongoDB 连接到数据库
```js
// url: The connection URI string
// options: Optional settings, 可选
// callback: The command result callback, 可选
// return: A new MongoClient instance
new MongoClient(url, options, connectCallback) => MongoClient instance

// static method
// 如果没有提供 callback, 则返回一个 promise
MongoClient.connect(url, options, connectCallback) => promise
```
### 实例方法
```js
// 创建实例：
const client = new MongoClient(url, options)
```
#### client.connect(connectCallback) => promise
```js
// 链接到数据库
// callback: connectCallback(err, client) => {}
client.connect((err, client) => {
  assert.equal(null, err)
  const myDB = client.db('myDB')
  // ...
  client.close()
}) 

// 如果不提供 callback, 则返回一个 promise
client.connect().then(client => {}).catch(err => {})
```
#### client.close(force, callback) => promise
关闭数据库链接

#### client.db(dbName, options) => db instance
create or retrieve the specified database

#### client.isConnected(options) => Boolean

### connectCallback(err, client)
The callback format for results
+ `err`: An error instance representing the error during the execution.
+ `client`: The connected client.

## [Db](http://mongodb.github.io/node-mongodb-native/3.1/api/Db.html)
获取数据库实例：
```js
const db = client.db('dbName')
```
### 实例方法
#### db.addUser(username, password, options, resultCallback) => promise
Add a user to the database

#### db.admin() => Admin db instance
Return the Admin db instance

#### db.collection(name, options, collectionResultCallback) => Collection instance (non-strict mode)
Fetch a specific collection (containing the actual collection information). If the application does not use strict mode you
can use it without a callback in the following way: 
```js
// non-strict mode
const collection = db.collection('mycollection')

// strict mode
db.collection('mycollection', (err, collection) => {
  assert.equal(null, err)
  // do something with collection
})
```

#### db.collections(options, collectionsResultCallback) => promise
Fetch all collections for the current db.

#### db.createCollection(collectionName, options, collectionResultCallback) => promise
Create a new collection on a server with the specified options. Use this to create capped collections.

`options`:
+ `capped`: `Boolean`, whether or not create a capped collection
+ `size`: `Number`, The size of the capped collection in bytes. 如果 `capped` 指定为 `true`, `size` 必须指定大小
+ `max`: `Number`, The maximum number of documents in the capped collection.
+ `validator`: `Object`, Allows users to specify validation rules or expressions for the collection.
+ `validatorLevel`: 
  + `off`: No validation for inserts or updates.
  + `strict`: Default, Apply validation rules to all inserts and all updates.
  + `moderate`: Apply validation rules to inserts and to updates on existing valid documents. Do not apply rules to updates on existing invalid documents.
+ `validatorAction`: 
  + `error`: Default, Documents must pass validation before the write occurs. Otherwise, the write operation fails.
  + `warn`: Documents do not have to pass validation. If the document fails validation, the write operation logs the validation failure.
+ `collation`: `Object`, Specify collation (MongoDB 3.4 or higher) settings for update operation

[JSON schema](https://docs.mongodb.com/manual/reference/operator/query/jsonSchema/#definition) validation:
```js
const validator = {
  $jsonSchema: {
    bsonType: 'object',
    required: ['name', 'year', 'major', 'gpa', 'address.city', 'address.street'],
    properties: {
      name: {
        bsonType: 'string',
        description: 'must be a string and is required'
      },
      gender: {
        bsonType: 'string',
        description: 'must be a string and is not required'
      },
      year: {
        bsonType: 'int',
        minimum: 2017,
        maximum: 3017,
        exclusiveMaximum: false, // 不排除最大值，排除：true
        description: 'must be an integer in [2017, 3017] and is required'
      },
      major: {
        enum: ['math', 'english', 'computer science'],
        description: 'can only be one of the enum values and is required'
      },
      gap: {
        bsonType: ['double'],
        minimum: 0,
        description: 'must be a double and is required'
      },
      'address.city': {
        bsonType: 'string',
        description: 'must be a string and is required'
      },
      'address.street': {
        bsonType: 'string',
        description: 'must be a string and is required'
      }
    }
  }
}

db.createCollection('students', { validator })
```
#### db.listCollections(filter, options) => CommandCursor
Get the list of all collection information for the specified db.
#### db.createIndex(collectionName, fieldOrSpec, options, resultCallback) => promise


###3 db.dropCollection(collectionName, options, resultCallback) => promise
Drop a collection from the database, removing it permanently. New accesses will create a new collection


#### db.dropDatabase(options, resultCallback) => promise
Drop a database, removing it permanently from the server.

#### db.indexInformation(collectionName, options, resultCallback) => promise
Retrieves this collections index info.

#### db.renameCollection(fromCollection, toCollection, options, collectionResultCallback) => promise
Rename a collection.
#### db.stats(options, resultCallback) => promise
Get all the db statistics.
### collectionResultCallback(err, collection)
The callback format for the `collection` method, must be used if strict is specified
+ `err`: An error instance representing the error during the execution.
+ `collection`: The collection instance

## [Collection](http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html)
实例：
```js
const collection = db.collection('mycollection')
```
### 实例方法
#### collection.aggregate(pipeline, options, aggregationCallback) => null | aggregationCursor
Execute an aggregation framework pipeline against the collection, needs MongoDB >= 2.2

#### collection.bulkWrite(operations, options, bulkWriteOpCallback) => promise
Perform a bulkWrite operation without a fluent API

#### collection.countDocuments(query, options, countCallback) => promise
Gets the number of documents matching the filter.

#### collection.createIndex(fieldOrSpec, options, resultCallback) => promise
Creates an index on the db and collection collection, similar to `db.createIndex(collectionName,fieldOrSpec, options, resultCallback)`


#### collection.createIndexes(indexSpecs, options, resultCallback) =>  promise
Creates multiple indexes in the collection, this method is only supported for
MongoDB 2.6 or higher.

#### collection.insertOne(doc, options, insertOneWriteOpCallback) => promise
```js
db.collection('inventory').insertOne(
  {
    name: 'xiaomi8',
    price: 2999,
    size: {
      h: 150,
      w: 70,
      uom: 'mm'
    }
  }
).then(res => {
  console.log(res.insertedCount) // 1 成功插入的 document 个数
  console.log(res.insertedId) // The driver generated ObjectId for the insert operation
}).catch(err => console.log(err))
```

#### collection.insertMany(docs, options, insertWriteOpCallback) => promise
```js
db.collection('inventory').insertMany(
  [
    { name: 'iphone8', price: 8888, size: { h: 170, w: 86, uom: 'mm' } },
    { name: 'huawei10', price: 5899, size: { h: 157, w: 76, uom: 'mm' } },
    { name: 'xiaomiMix3', price: 3299, size: { h: 155, w: 73, uom: 'mm' } }
  ],
  (err, res) => {
    assert.equal(null, err)
    assert.equal(3, res.insertedCount)
    console.log(`inserted 3 documents into inventory collection`)
  }
)
```
关于 `options` 请查看[API文档](http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#insertMany)
#### collection.find(query, options) => Cursor
+ `query` Object: 
  + Comparison Query Operators:
    + `$eq`: ==
    + `$ne`: !=
    + `$gt`: >
    + `$gte`: >=
    + `$lt`: <
    + `$lte`: <=
    + `$in`: 存在于其中
    + `$nin`: 不存在于其中

  + Logical Query Operators:
    + `$and`: 与
    + `$not`: 非
    + `$or`: 或
    + `$nor`:  

  + Element Query Operators:
    + `$exists`: 字段是否存在
    + `$type`:  指定类型

  + Evaluation Query Operators:
    + `$regex`:  模式匹配

  + Array Query Operators:
    + Query an Array for an Element:
      + `{ arrayField: elem }` : 查找 `arrayField` 数组中包含 `elem` 元素的 document
      + `{ arrayField: { $gt: value } }` : 查找 `arrayField` 数组中至少有一个元素的值大于`value` 的 document
      + `{ arrayField: { $gt: value1, $lt: value2 } }` : 查找 `arrayField` 数组中存在某个元素或者多个元素组合满足指定的条件的 document。（不针对某一个元素）
    + `$all`: 包含指定的元素，不考虑顺序:
      + `{ arrayFiled: { $all: [ elem1, elem2, ... ] } }`
    + `$elemMatch`: Query for an Array Element that Meets Multiple Criteria:
      + `{ arrayField: { $elemMatch: { $gt: value1, $lt: value2 } } }`
    + `$size`: Query an Array by Array Length:
      + `{ arrayField: { $size: 3 } }`: 查找 `arrayField` 数组元素个数满足指定条件的 document
    + Query for an Element by the Array Index Position:
      + `{ 'arrayField.1': { $in: [ value1, value2 ] } }`: 查找 `arrayField` 数组中第二个元素满足指定条件的 document
+ `options` Object (optional)
  + `limit`: `Number`, Sets the limit of documents returned in the query.
  + `sort`: `Array|Object`, Set to sort the documents coming back from the query. Array of indexes, [['a', 1]] etc.
  + `projection`: `Object`, The fields to return in the query. Object of fields to include or exclude (not both), {'a':1}
  + `skip`: `Number`, Set to skip N documents ahead in your query (useful for pagination).
  + `hint`: `Object`, Tell the query to use specific indexes in the query. Object of indexes to use, {'_id':1}
  + `collation`: `Object`, Specify collation (MongoDB 3.4 or higher) settings for update operation (see 3.4 documentation for available fields).
  + 更多请查看[API文档](http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find)

`query` 用法
```js
// 查找 collection 中所有的 document:
collection.find({})

collection.find({ field: value })
// 等同于
collection.find({ field: {$eq: value} })

collection.find({ field1: { $ne: value1 }, field2: { $gt: value2 } }) 
// 等同于
collection.find({
  $and: [
    { field1: { $ne: value1 } },
    { field2: { $gt: value2 } }
  ]
})

// $or, $lt, $in
collection.find({
  $or: [
    { field1: { $lt: value1 } },
    { field2: { $in: [ value2, value3, value4] } }
  ]
})

// $not, $exists, $type, $regex
collection.find({
  field1: { $not: { $lte: value1 } }
  $or: [
    { field2: { $exists: true }, field3: { $type: 'string' } },
    { field4: { $regex: /pattern/ } }
  ]
})

```
`options` 用法
```js
const cursor = db.collection('inventory').find(
  // query
  { price: { $lt: 50 } }, 
  // options
  {  
    projection: { name: 1, count: 1 },
    skip: 10,
    limit: 20
  }
)
```
`options`中所有的选项都可以在 `find` 返回的 `Cursor` 中配置，因此可以在调用 `find` 时不提供 `options`

Cursor
```js
const cursor = db.collection('inventory').find({ price: { $lt: 50 } })

cursor.skip(number) => Cursor
cursor.limit(number) => Cursor
cursor.collation(object) => Cursor
cursor.project(object) => Cursor
cursor.filter(object) => Cursor
cursor.hint(object) => Cursor
cursor.skip(10).limit(20).project({ name: 1, count: 1 })

cursor.forEach(iteratorCallback, endCallback) => promise
cursor.forEach(doc => {
  console.log(doc.name)
}, err => {
  console.err(err)
})

cursor.map(transform) => Cursor
cursor.map(doc => {
  return doc.name
})

cursor.sort(sortObject) => Cursor
cursor.sort({ price: 1, name: -1 }) // price 升序， name 降序

cursor.next(resultCallback) => promise // Get the next available document from the cursor, returns null if no more documents are available.
cursor.next((err, doc) => {
  assert.equal(null, err)
  console.log(doc) // document or null
})

cursor.hasNext(resultCallback) => promise // Check if there is any document still available in the cursor
cursor.hasNext((err, res) => {
  assert.equal(null, err)
  console.log(res) // true or false
})

cursor.toArray(toArrayResultCallback) => promise
cursor.toArray((err, docs) => {
  assert.equal(null, err)
  console.log(Array,isArray(docs)) // true
})
```
#### collection.findOne(query, options, resultCallback) => promise
```js
db.collection('inventory').findOne(
  { price: { $gt: 20 } },
  { projection: { name: 1, price: 1, _id: 0 } },
  (err, doc) => {
    assert.equal(null, err)
    console.log(doc) // 返回与 `query` 匹配的第一个 document
  }
)
```

#### collection.findOneAndDelete(filter, options, findAndModifyCallback) => promise

#### collection.findOneAndReplace(filter, replacement, options, findAndModifyCallback) => promise
Find a document and replace it in one atomic operation. Requires a write lock for the duration of the operation.
```js
db.collection('inventory').findOneAndReplace(
  { price: { $lt: 10 } },
  { name: 'keyboard', price: 34.6 },
  { 
    upsert: true, 
    returnOriginal: false, // returnOriginal 默认为 true， 返回匹配到的原始 document
    projection: {name: 1, _id: 0}, // 设置返回哪些字段，同 find 方法
    sort: { name: 1 } } // 当 filter 匹配多个document时，决定哪个 document 被替换，省略这个选项时，默认替换按自然顺序匹配的第一个 document
).then(res => {
  console.log(res.value) // { upsert: true, returnOriginal: false }
  console.log(res.ok) // Is 1 if the command executed correctly.
})
```
关于第二参数 `replacement`, 不能包含 update operators, 而且不能指定与被更新的 document 不同的 `_id`, 最好是不要指定 `_id` 字段，默认替换匹配到第一个document的除了 `_id` 之外的所有字段。
#### collection.findOneAndUpdate(filter, update, options, findAndModifyCallback) => promise
Find a document and update it in one atomic operation. Requires a write lock for the duration of the operation.
用法与 `findOneAndDelete` 类似，除了第二个参数 `update`, update document 用法与 `updateOne, updateMany` 相同
#### collection.updateOne(filter, update, options, updateWriteOpCallback) => promise
`filter` 类似 `find` 方法的 `query` 参数

Update Operators
+ [Field Update Operators](https://docs.mongodb.com/manual/reference/operator/update-field/)
  + `$inc`: increments a field by a specified value
  + `$min`: updates the value of the field to a specified value if the specified value is less than the current value of the field
  + `$max`: updates the value of the field to a specified value if the specified value is greater than the current value of the field
  + `$mul`: Multiply the value of a field by a specified value
  + `$rename`: updates the name of a field
  + `$set`: replaces the value of a field with the specified value.
  + `$setOnInsert`: If an update operation with `upsert: true` results in an insert of a document, then `$setOnInsert` assigns the specified values to the fields in the document. If the update operation does not result in an insert, `$setOnInsert` does nothing.
  + `$unset`: deletes a particular field
  + `$currentDate`: sets the value of a field to the current date, either as a Date or a timestamp
+ [Array Update Operator](https://docs.mongodb.com/manual/reference/operator/update-array/)
  + `$`: The positional `$` operator identifies an element in an array to update without explicitly specifying the position of the element in the array.
  + `$[]`: The all positional operator `$[]` indicates that the update operator should modify all elements in the specified array field.
  + `$[<identifier>]`: The filtered positional operator `$[<identifier>]` identifies the array elements that match the `arrayFilters` conditions for an update operation. 
  + `$addToSet`: The `$addToSet` operator adds a value to an array unless the value is already present, in which case `$addToSet` does nothing to that array. `$addToSet` only ensures that there are no duplicate items added to the set and does not affect existing duplicate elements.
  + `$push`: The `$push` operator appends a specified value to an array
  + `$pull`: The `$pull` operator removes from an existing array all instances of a value or values that match a specified condition.
  + `$pullAll`: The `$pullAll` operator removes all instances of the specified values from an existing array. Unlike the `$pull` operator that removes elements by specifying a query, `$pullAll` removes elements that match the listed values.
  + `$pop`: The `$pop` operator removes the first or last element of an array. Pass `$pop` a value of `-1` to remove the first element of an array and `1` to remove the last element in an array.
  + `$each`: The `$each` modifier is available for use with the `$addToSet` operator and the `$push` operator.
  + `$position`: The `$position` modifier specifies the location in the array at which the `$push` operator inserts elements. Without the `$position` modifier, the `$push` operator inserts elements to the end of the array. See `$push` modifiers for more information. To use the `$position` modifier, it must appear with the $each modifier.
  + `$slice`: The `$slice` modifier limits the number of array elements during a `$push` operation. To project, or return, a specified number of array elements from a read operation, see the `$slice` projection operator instead. To use the `$slice` modifier, it must appear with the `$each` modifier. You can pass an empty array [] to the `$each` modifier such that only the `$slice` modifier has an effect.
  + `$sort`: The `$sort` modifier orders the elements of an array during a `$push` operation. To use the `$sort` modifier, it must appear with the `$each` modifier. You can pass an empty array `[]` to the `$each` modifier such that only the `$sort` modifier has an effect.
```js
// 'arrayField.$' 用于更新满足查询条件的数组的单个元素，查询条件中必须要包含数组字段，且不能和 { upsert: true } 搭配使用
// 当不知道要更新的数组元素具体在哪个索引位置时，就可以使用 '$' 更新操作符，如果提前知道具体的索引位置，使用 dot notation
//例如如下操作，将所有满足查询条件（grades组数包含大于100的元素）的 document 的 grades 数组中第一个匹配的元素(第一个大于100的元素)设置为100
students.updateMany(
  { grades: { $gt: 100 } },
  { $set: { 'grades.$': 100 } },
  (err, res) => {}
)

// 'arrayField.$[]' 会更新满足条件的数组的所有元素，例如下面会将第一个满足条件的 document 的 grades 数组元素全部设置为100
students.updateOne(
  { grades: { $gt: 100 } },
  { $set: { 'grades.$[]': 100 } },
  (err, res) => {}
)

// '$[<identifier>]' 与 'arrayFilters' options 配合使用，用于在满足查询条件的 document(s) 中更新满足 'arrayFilters' 条件的所有数组元素
students.updateMany(
  { gender: 'female' },
  { $inc: {'grades.$[t].questions.$[score]': 2} }, // 这里 questions 是一个 nested Array
  { arrayFilters: [ { 't.type': 'quiz' }, { score: { $gte: 8 } } ] }
)
```
#### collection.updateMany(filter, update, options, updateWriteOpCallback) => promise
用法同 `updateOne`, 不同的是更新满足 `filter` 条件的所有 document
#### collection.deleteOne(filter, options, deleteWriteOpCallback) => promise
#### collection.deleteMany(filter, options, deleteWriteOpCallback) => promise
```js
// 删除 collection 中所有 document
db.collection('inventory').deleteMany({}, (err, res) => {
  assert.equal(null, err)
  console.log(res.deletedCount) // The number of documents deleted
  console.log(res.result.ok) // Is 1 if the command executed correctly.
  console.log(res.result.n) // The total count of documents deleted
})
```

#### collection.replaceOne(filter, doc, options, callback)
Replace a document in a collection with another document

#### collection.drop
#### collection.dropIndex
#### collection.dropIndexes
#### collection.indexes
#### collection.indexExists
#### collection.isCapped


### Type Definition
#### insertOneWriteOpCallback(err, res)
+ `err`: An error instance representing the error during the execution.
+ `res`: `insertOneWriteOpResult`, The result object if the command was executed successfully. 

`insertOneWriteOpResult`:
  + `insertedCount`: `Number`, The total amount of documents inserted.
  + `ops`: `Array<object>`, All the documents inserted using insertOne/insertMany/replaceOne. Documents contain the _id field if forceServerObjectId == false for insertOne/insertMany
  + `insertedId`: `ObjectId`, The driver generated ObjectId for the insert operation.
  + `connection`: `object`, The connection object used for the operation.
  + `result`: `object`, The raw command result object returned from MongoDB (content might vary by server version).
    + `ok`: `Number`, Is 1 if the command executed correctly.
    + `n`: `Number`, The total count of documents inserted.








+ `insertOne(document, (err, res) => {})`
+ `insertMany([...documents], (err, res) => {})`

+ `find({}).toArray((err, res => {}))`
+ `find({field: filter}).toArray((err, res) => {})`


+ `updateOne({field: filter}, {setter: {field: value}}, (err, res) => {})`
+ `updateMany({field: filter}, {setter: {field: value}}, (err, res) => {})`

+ `deleteOne({select: value}, (err, res) => {})`
+ `deleteMany({select: value}, (err, res) => {})`

```js
findOneAndUpdate(
  { field: filter }, // 过滤条件
  { setter: { field: value } }, // 更新
  { collation: { ...options } }, // 排序规则，可选，若省略使用默认的排序规则
  (err, res) => {
    assert.equal(null, err)
    else {
      if(res.value) 
        console.log(res.value) // 更新前的 document
      else
        console.log('Not Found')
    }
    client.close()
  } 
)

```
`findOneAndDelete`, `findOneAndReplace` 用法同 `findOneAndUpdate`

## Collection
### Capped Collection
To create a capped collection, use the `createCollection` method and specify `'capped' : true`
```js
db.createCollection('myCollection', {
  'capped': true,
  'size': 100000,
  'max': 5000
}, (err, res) => {
  //
})
```
### Document Validation
Collections with validation compare each inserted or updated document against the criteria specified in the `validator` option. Depending on the `validationLevel` and `validationAction`, MongoDB either returns a warning, or refuses to insert or update the document if it fails to meet the specified criteria.
```js
db.createCollection('contacts', {
  validator: {
    $or: [
      { phone: { $type: 'string' } },
      { email: { $regex: /.../ } },
      { status: { $in: [ 'Unknown', 'Incomplete'] } }
    ]
  }
}, (err, res) => {
  assert.equal(null, err)
  console.log('Collection created')
})
```

## Create Indexes
To create an index on a field or fields, pass an index specification document to the `createIndex()` method: `{ field1: type1, field2: type2, ... }`

### Create an Ascending Index
For an ascending index type, specify `1` for `type`:
```js
function createAscendingIndex(db, callback) {
  const collection = db.collection('users')
  collection.createIndex(
    { dateOfBirthday: 1 },
    (err, res) => {
      assert.equal(null, err)
      callback(res)
    }
  )
}
```
### Create a Descending Index
For a descending index type, specify `-1` for `type`:
```js
function createDescendingIndex(db, callback) {
  const collection = db.collection('users')
  collection.createIndex(
    { lastname: -1 },
    (err, res) => {
      asser.equal(null, err)
      callback(res)
    }
  )
}
```

### Create a Compound Index
```js
function createCompoundIndex(db, callback) {
  const collection = db.collection('users')
  collection.createIndex(
    { lastname: -1, dateOfBirthday: 1 },
    (err, res) => {
      assert.equal(null, err)
      callback(res)
    }
  )
}
```

### Create a Text Index
```js
function createTextIndex(db, callback) {
  const collection = db.collection('users')
  collection.createIndex(
    { comments: 'text' },
    (err, res) => {
      assert.equal(null, err)
      callback(res)
    }
  )
}
```