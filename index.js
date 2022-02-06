const express = require('express')
const app = express()
const port = 3000
const morgan = require('morgan')
const bodyParser = require('body-parser')
var user = require('./api/user'); // /index.js 생략가능

if(process.env.NODE_ENV !== 'test'){
  app.use(morgan('dev'));
}

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use('/users', user)

// 테스트 모듈로 사용하기 위해
module.exports = app;
