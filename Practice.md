## 用户注册信息验证 (Express + MongoDB)
假设 `username` 和 `email` 必须唯一，以此来验证用户的注册信息是否可用
### 使用 Promise.all
```js
function registerInfoCheck(req, res, next) {
  const users = db.collection('users')
  Promise.all([
    users.findOne({ username: req.body.username }),
    users.findOne({ email: req.body.email})
  ]).then(([user1, user2]) => {
    if (user1) res.send({ result: 'fail', msg: '用户名已存在！' })
    else if (user2) res.send({ result: 'fail', msg: '邮箱已被注册过!' })
    else {
      const hash = bcrypt.hashSync(req.body.password, 10)
      req.body.password = hash
      next()
    }
  })
    .catch(next)
}
```
### 使用 async/await
```js
async function registerInfoCheck(req, res, next) {
  const users = db.collection('users')
  try {
    const [user1, user2] = await Promise.all([
      users.findOne({ username: req.body.username }),
      users.findOne({ email: req.body.email})
    ])
    if (user1) res.send({ result: 'fail', msg: '用户名已存在！' })
    else if (user2) res.send({ result: 'fail', msg: '邮箱已被注册过!' })
    else {
      const hash = await bcrypt.hash(req.body.password, 10)
      req.body.password = hash
      next()
    }
  } catch (error) {
    next(error)
  }
}
```