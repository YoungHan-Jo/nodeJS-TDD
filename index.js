const express = require('express')
const app = express()
const port = 3000

const morgan = require('morgan')
const bodyParser = require('body-parser')

var users = [
    {id: 1, name: 'alice'},
    {id: 2, name: 'bek'},
    {id: 3, name: 'chris'}
]

app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/users', (req, res) => {
  req.query.limit = req.query.limit || 10; // req.query.limit의 값이 없으면 기본값 10으로
  const limit = parseInt(req.query.limit, 10); // 10w진법 정수로 변환
  if(Number.isNaN(limit)){ // 숫자가 아니면
    return res.status(400).end(); // 400을 응답
  }
  res.json(users.slice(0,limit));
})

app.get('/user/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if(Number.isNaN(id)){
    return res.status(400).end();
  }
  const user = users.filter((user) => user.id === id)[0];
  if(!user){
    return res.status(404).end();
  }
  res.json(user);

})

app.delete('/user/:id', (req,res) => {
  const id = parseInt(req.params.id, 10);
  if(Number.isNaN(id)){
    return res.status(400).end();
  }
  users = users.filter(user => user.id !== id);
  return res.status(204).end();
})

app.post('/user', (req,res) => {
  const name = req.body.name;
  if(!name){
    return res.status(400).end();
  }
  const dbUsers = users.filter((user) => user.name === name);
  if(dbUsers.length > 0){
    return res.status(409).end();
  }
  const id = Date.now();
  const user = {id,name};
  users.push(user);
  res.status(201).json(user);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

// 테스트 모듈로 사용하기 위해
module.exports = app;
