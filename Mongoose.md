### `Model.exists(filter: any, callback?: (err: any, res: boolean) => void): Promise<boolean>`
检查是否存在与 filter 匹配的 document, 不提供 callback 则返回 promise
```ts
User.exists({email: 'nicholas@gmail.com'}, (err, exist) => {
  if(err) return next(err) // pass to error handler
  if (exist) {
    res.status(400).send('Email has already been taken')
  } else {
    next() // pass to next middleware
  }
}
// or 
try {
  const exist = await User.exists({email: 'nicholas@gmail.com'})
  if (exist) {
    res.status(400).send('Email has already been taken')
  } else {
    next() // pass to next middleware
  }
} catch (err) {
  next(err) // pass to error handler
}

```
### `Model.create(docs, options, callback): Promise<Document>`
保存一个或多个 document 到 database，实际上是 `Model.prototype.save` 方法的 shortcut，该方法内部为每个 doc 调通 `save` 方法

如果要提供 `options` 参数， `docs` 必须是数组。`options` 会传递给 `Model.prototype.save` 方法。

如果不提供 callback 则返回 promise
```js
const user1 = {name: 'Lucy', email: 'lucy@gmail.com'}
const user2 = {name: 'Jack', email: 'Jack@gmail.com'}

// 如果不需要提供 options 参数， docs 可以不必是数组的形式，可以将每个 doc 作为单个参数传入
User.create(user1, user2, (err, docs) => {
  if(err) return next(err)
  res.send(docs)
})

// docs 是数组的形式
User.create([user1,user2])
  .then(docs => res.send(docs))
  .catch(next)

```