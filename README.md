# NodeJS TDD

-------------------
# 01 노드JS는 이벤트 기반의 비동기 I/O 프레임워크

클라이언트에서 서버로 요청 
-> 요청을 이벤트로 만들어서 이벤트 큐에 쌓음 
-> Event Loop (single thread)에서 이벤트 큐에 쌓인 job을 하나씩 처리함
-> 클라이언트로 결과를 응답함

Event Loop에서 시간이 오래 걸리는 작업들은 다른쓰레드(Non-blocking Worker)에게 위임함
-> 워커가 처리한 뒤 다시 이벤트루프에게 전달함
-> 이벤트 루프가 클라이언트로 결과를 응답함

----------------------
# 02 모듈 시스템

JS - 브라우저에서는 window 전역객체를 사용하거나, RequireJS 같은 의존성 로더를 사용함

노드는 파일 형태로 모듈을 관리할 수 있는 CommonJS로 구현
- 기본 모듈 : 노드에 기본적으로 있는 모듈 ex) http

- 써드파티 모듈

- 사용자 정의 모듈 : 사용자가 만든 모듈

// math.js
module.exports = {
    sum: function(a,b){
        return a + b;
    },
    minus: function(a,b){
        return a - b;
    }
}

// index.js
const math = require('./math.js');

math.sum(2,3);

----------------------------
# 04 Express

- 어플리케이션
    const app = express();
- 미들웨어
- 라우팅
- 요청객체
- 응답객체

------------------------
# 05 미들웨어 vs 에러 미들웨어

미들웨어는 함수들의 연속
// 인터페이스가 정해져 있음 - req,res,next 파라미터로 받음
// 자기가 한 일이 끝나면 next()를 호출 - next()가 반드시 있어야함. req.session = 'ABC' 처럼 req객체 이용가능
function logger1(req, res, next){
    console.log('I am logger1');
    next();
}
function logger2(req, res, next){
    console.log('I am logger2');
    next();
}
app.use(logger1);
app.use(logger2);

에러 미들웨어 

function commonMw(req, res, next){
console.log('commonMw');
next(new Error('error occurred'));
}

function errorMw(err, req, res, next){
    console.log(err.message);
    // 에러를 처리하거나
    next();
    // 다음 미들웨어로 에러를 넘김
    // next(err); 
}

app.use(commonMw);
app.use(errorMw);

-------------------------
# 06 Express

const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

여기서 (req,res) 요청 응답 객체는
http의 req,res와는 다른 express의 req,res 객체임

-----------------
# 07 npm

npm 초기화
- npm init

npm install express 이렇게만 하면 node_modules에 파일만 설치함

npm install express -s 를 넣어주면 package.json에 기록해 둠.

디펜던시에 등록된 모듈 설치
- npm install

package.json에 있는 'scripts'

    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node index.js"
    },

- npm test
- npm start
등으로 실행 가능