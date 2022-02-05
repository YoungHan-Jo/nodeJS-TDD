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
- 인터페이스가 정해져 있음 - req,res,next 파라미터로 받음
- 자기가 한 일이 끝나면 next()를 호출 - next()가 반드시 있어야함. req.session = 'ABC' 처럼 req객체 이용가능

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

-------------------
# 08 HTTP

http 요청
- 모든 자원은 명사로 식별한다
- http 경로로 자원을 요청한다

- ex) GET /users/{id}

http 메서드
- 서버 자원에 대한 행동을 나타낸다.(동사로 표현)
- GET / POST / PUT / DELETE
- 이는 익스프레스 어플리케이션의 메소드로 구현되어 있다

-----------------------
# 09 HTTP 상태코드

- 200: 성공(success), GET, PUT
- 201: 작성됨(created), POST
- 204: 내용 없음 (No Conent), DELETE

- 400: 잘못된 요청 (Bad Request) // 파라미터가 없다거나
- 401: 권한 없음 (Unauthorized)  // 로그인하지 않았을때 접근하면
- 404: 찾을 수 없음 (Not found)  // 요청한 자원이 서버에 없을때
- 409: 충돌 (Conflict) // 이미 있는 자원인데 또 생성하면 충돌

- 500: 서버 에러 (Interel server error)

------------------------
# 10 GET /users API 만들기

터미널에
curl -X GET 'localhost:3000/users' -v 입력

'>' 요청에 대한 정보
'<' 응답에 대한 정보

    Note: Unnecessary use of -X or --request, GET is already inferred.
*   Trying ::1:3000...
* Connected to localhost (::1) port 3000 (#0)
> GET /users HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.77.0
> Accept: */*
> 
* Mark bundle as not supporting multiuse     
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Content-Type: application/json; charset=utf-8
< Content-Length: 71
< ETag: W/"47-AswcodMnmv7+S9S8PW5fCVVRgCc"
< Date: Sat, 05 Feb 2022 10:59:10 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
[{"id":1,"name":"alice"},{"id":2,"name":"bek"},{"id":3,"name":"chris"}]* Connection #0 to host localhost left intact

----------------------------
# 11 테스트 주도 개발 (TDD)

- mocha
- should
- superTest

---------------------------
# 12 mocha

https://mochajs.org/

npm i mocha --save-dev
dev환경으로 설치 -> pachage.json에 devDependencies에 나오게 됨

- 모카(mocha)는 테스트 코드를 돌려주는 테스트 러너

- 테스트 수트: 테스트 환경, 모카에서는 describe()으로 구현한다
- 테스트 케이스: 실제 테스트, 모카에서는 it()으로 구현한다

xxx.spec.js 파일은 테스트파일을 의미함
// utils.spec.js

    const utils = require('./utils');
    const assert = require('assert'); // js 기본모듈

    describe('utils.js모듈의 capitalize() 함수는 ', () => {
        it('문자열의 첫번째 문자를 대문자로 변환한다', () => {
            const result = utils.capitalize('hello');
            assert.equal(result, 'Hello');
        })
    })

node_modules/.bin/mocha utils.spec.js 명령어로 실행

----------------------------
# 13 should

https://github.com/tj/should.js/

npm i should --save-dev

- "노드 assert 말고 서드파티 라이브러리를 사용하라"
- 슈드(should)는 검증(assertion) 라이브러리다 
- 가독성 높은 테스트 코드를 만들 수 있다

        const utils = require('./utils');
        const should = require('should'); // js 기본모듈

        describe('utils.js모듈의 capitalize() 함수는 ', () => {
            it('문자열의 첫번째 문자를 대문자로 변환한다', () => {
                const result = utils.capitalize('hello');
                result.should.be.equal('Hello');
            })
        })

--------------------------
# 14 superTest

- 단위 테스트: 함수의 기능 테스트 ( should )
- 통합 테스트: API의 기능 테스트 ( superTest )
- 슈퍼 테스트는 익스프레스 통합 테스트용 라이브러리다 
- 내부적으로 익스프레스 서버를 구동시켜 실제 요청을 보낸 뒤 결과를 검증한다