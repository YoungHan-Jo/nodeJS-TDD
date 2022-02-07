# NodeJS TDD

# 00 VS Code 단축키

https://www.inflearn.com/news/30755

덩어리로 드래그하기
- alt shift 좌/우

블록 끝으로 이동 
- ctrl shift \

함수 이름에서 F2누르면 사용되고 있는 이름도 같이 변경

사용중인 함수 정의로 가기
- F12

함수 사용하는곳 검색
- alt shift F12

파일탐색기로 이동
- alt 0

에디터로 이동
- alt 1

파일 바로가기
- ctrl P

커맨드창
- ctrl shift C






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

https://github.com/visionmedia/supertest#readme

- 단위 테스트: 함수의 기능 테스트 ( should )
- 통합 테스트: API의 기능 테스트 ( superTest )
- 슈퍼 테스트는 익스프레스 통합 테스트용 라이브러리다 
- 내부적으로 익스프레스 서버를 구동시켜 실제 요청을 보낸 뒤 결과를 검증한다

// index.js

    // 테스트 모듈로 사용하기 위해
    module.exports = app;


// index.spec.js

    const app = require('./index');
    const request = require('superTest');

    describe('GET /users는 ', () => {
        it('...', (done) => {
            request(app)
                .get('/users')
                .end((err,res) => {
                    console.log(res.body);
                    done();
                })
        })
    })

# 15 API 테스트 GET /users

    const request = require('superTest');
    const should = require('should')
    const app = require('./index');

    describe('GET /users는 ', () => {
        describe('성공시', () => {
            it('유저 객체를 담은 배열로 응답한다.', (done) => {
                request(app)
                    .get('/users')
                    .end((err,res) => {
                        res.body.should.be.instanceOf(Array);
                        done();
                    })
            })
        })
    })

// package.json

    "test": "mocha index.spec.js",

으로 설정하면
npm test로 테스트 실행 가능

# 16 실패 테스트

// index.spec.js

    describe('실패시', () => {
        it('limit이 숫자형이 아니면 400을 응답한다. ', (done) => {
            request(app)
                .get('/users?limit=two')
                .expect(400) // 상태코드는 굳이 res객체로 should.be를 사용하지 않아도됨
                .end(done); // done만 있으면 이렇게 줄여서 쓸 수 있음
        })
    })

// index.js

    app.get('/users', (req, res) => {
    req.query.limit = req.query.limit || 10; // req.query.limit의 값이 없으면 기본값 10으로
    const limit = parseInt(req.query.limit, 10); // 10w진법 정수로 변환
    if(Number.isNaN(limit)){ // 숫자가 아니면
        return res.status(400).end(); // 400을 응답
    }
    res.json(users.slice(0,limit));
    })

# 17 GET /user/:id 테스트

//index.spec.js

    describe('GET /users/1은 ', () => {
        describe('성공시', () => {
            it('id가 1인 유저 객체를 반환한다', (done) => {
                request(app)
                    .get('/user/1')
                    .end((err,res) => {
                        res.body.should.have.property('id', 1); // 객체의 id 가 1이어야한다.
                        done();
                    })
            })
        })
    });

//index.js

    app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10); // req.params.id 로 가져오기
    const user = users.filter((user) => user.id === id)[0];
    res.json(user);

    })

----------------------
# 18 GET /user/:id 실패 테스트

//index.spec.js

    describe('실패시', () => {
        it('id가 숫자가 아닐경우 400으로 응답한다. ', (done) => {
            request(app)
                .get('/user/one')
                .expect(400)
                .end(done);
        });
        it('id로 유저를 찾을 수 없을 경우 404로 응답한다.', (done) => {
            request(app)
                .get('/user/999')
                .expect(404)
                .end(done);
        })
    })

// index.js

    app.get('/user/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    if(Number.isNaN(id)){
        return res.status(400).end();
    }
    const user = users.filter((user) => user.id === id)[0];
    if(!user){ // user이 undefined 일 때
        return res.status(404).end();
    }
    res.json(user);

    })

-------------------
# 19 DELETE /user/:id

// index.spec.js

    describe('DELETE /user/1은', () => {
        describe('성공시', () => {
            it('204를 응답한다.', (done) => {
                request(app)
                    .delete('/user/1')
                    .expect(204)
                    .end(done);
            })
        })
    })

// index.js

    app.delete('/user/:id', (req,res) => {
    const id = parseInt(req.params.id, 10);
    users = users.filter(user => user.id !== id);
    return res.status(204).end();
    })

---------------
# 20 DELETE /user/:id 실패시

// index.spec.js

    describe('실패시', () => {
        it('id가 숫자가 아닐경우 400으로 응답한다.', (done) => {
            request(app)
                .delete('/user/one')
                .expect(400)
                .end(done);
        })
    })

-------------------
# 21 POST /user 

// index.spec.js

    describe('POST /user', () => {
        describe('성공시', () => {
            let name = 'daniel', // 중복제거
                body;
            before(done=>{
                request(app)
                    .post('/user')
                    .send({name}) // ES6 문법으로 name: 'danial'로 입력됨
                    .expect(201)
                    .end((err, res) => {
                        body = res.body; // 결과값을 body에 저장
                        done();
                    })
            })
            // it('201 상태코드를 반환한다.', (done) => {
            //     request(app)
            //         .post('/user')
            //         .send({name: 'daniel'})
            //         .expect(201)
            //         .end(done);
            // }) // 위에 before에서 체크하기 때문에 생략
            it('생성된 유저 객체를 반환한다.', () => { // 비동기가 아니라서 done 빼기
                body.should.have.property('id');
            });
            it('입력한 name을 반환한다.', () =>{
                body.should.have.property('name', name);
            })
        })
    })

// index.js

req.body에 접근하기 위해 body-parse 미들웨어 필요함

    app.post('/user', (req,res) => {
    const name = req.body.name;
    const id = Date.now();
    const user = {id,name};
    users.push(user);
    res.status(201).json(user);
    })

------------------
# 22 POST /user 실패 테스트

// index.spec.js

    describe('실패시', () => {
        it('name 파라미터 누락시 400을 반환한다.', (done) => {
            request(app)
                .post('/user')
                .send({})
                .expect(400)
                .end(done);
        })
        it('name이 중복일 경우 409를 반환한다.', (done) => {
            request(app)
                .post('/user')
                .send({name: 'daniel'})
                .expect(409)
                .end(done);
        })
    })

// index.js

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

-------------------
# 23 PUT /user/:id 

// index.spec.js

    describe('PUT /user/:id', () => {
        describe('성공시', () => {
            it('변경된 name을 응답한다.', (done) => {
                const name = 'charles';
                request(app)
                    .put('/user/3')
                    .send({name})
                    .end((err,res) => {
                        res.body.should.have.property('name', name);
                        done();
                    })
            })
        })
    })

// index.js

    app.put('/user/:id', (req,res) => {
    const id = parseInt(req.params.id, 10);
    const name = req.body.name;
    const user = users.filter(user => user.id === id)[0];
    user.name = name;
    
    res.json(user);
    })

--------------------
# 24 PUT /user/:id 실패 테스트

// index.spec.js

    describe('실패시', () => {
        const name = 'charles';
        it('정수가 아닌 id일 경우 400 응답', (done) => {
            request(app)
                .put('/user/three')
                .send({name})
                .expect(400)
                .end(done);
        })
        it('name이 없을 경우 400 응답', (done) => {
            request(app)
                .put('/user/3')
                .send({})
                .expect(400)
                .end(done);
        })
        it('없는 유저일 경우 404 응답', (done) => {
            request(app)
                .put('/user/999')
                .send({name : 'foo'})
                .expect(404)
                .end(done);
        })
        it('이름이 중복일 경우 409 응답', (done) => {
            request(app)
                .put('/user/3')
                .send({name : 'ben'})
                .expect(409)
                .end(done);
        })
    })

// index.js

    app.put('/user/:id', (req,res) => {
    const id = parseInt(req.params.id, 10);
    const name = req.body.name;
    if (Number.isNaN(id) || !name) return res.status(400).end();
    
    const isConflict = users.filter(user => user.name === name).length;
    if (isConflict) return res.status(409).end();

    const user = users.filter(user => user.id === id)[0];
    if (!user) return res.status(404).end();
    
    user.name = name;
    
    res.json(user);
    })

--------------------
# 25 라우터 코드정리

https://expressjs.com/ko/guide/routing.html

역할에 따라 파일로 분리
- api/user/index.js : 라우팅 설정

- api/user/user.ctrl.js : 컨트롤러, API

- api/user/user.spec.js : 테스트 코드
* 테스트 코드가 있으면 리팩토링에 부담이 없음

// api/user/index.js

    const express = require('express')
    const router = express.Router();
    const ctrl = require('./user.ctrl');

    router.get('/', ctrl.index);

    router.get('/:id', ctrl.show);

    router.delete('/:id', ctrl.destroy)

    router.post('/', ctrl.create)

    router.put('/:id', ctrl.update);

    module.exports = router;

// api/user/user.ctrl.js

    module.exports = { //es6문법
        index,
        show,
        destroy,
        create,
        update
    }

spec가 여러개로 늘어나면
find명령어로 테스트 파일을 찾아서 인자로 넘겨주는 방식,
모카 옵션에 --grep

--------------------
# 26 테스트 환경 개선

npm i cross-env -s 설치

테스트환경으로 npm test실행
//pachage.json

    "scripts": {
        "test": "cross-env NODE_ENV=test mocha api/user/user.spec.js",
        "start": "node index.js"
    },

테스트 환경에서 미들웨어 실행하지 않기
//index.js

    if(process.env.NODE_ENV !== 'test'){
    app.use(morgan('dev'));
    }

superTest는 서버를 돌리기 때문에
서버 구동시 로그가 뜨는데 없애기
index.js의 app.listen(3000,()=>...) 없애기
-> 없애면 npm start로 실제 서버 돌렸을때 서버 유지가 안됨.
-> bin/www.js 만들어서 여기서 서버 돌리기

    "scripts": {
        "test": "cross-env NODE_ENV=test mocha api/user/user.spec.js",
        "start": "node bin/www.js"
    },

--------------------
# 27 노드 ORM 시퀄라이져

npm i sequelize -s
npm i sqlite3 -s

• insert users (`name`) values ('alice');
→ User.create({name: 'alice'}) 

• select * from users;
→ User.findAll() 

• update users set name = 'bek' where id = 1;
→ User.update({name: 'bek'}, {where: {id: 1}}); 

• delete from users where id = 1;
→ User.destroy({where: {id: 1}});

User 객체를 모델 이라고 함
• 데이터베이스 테이블을 ORM으로 추상화한것을 모델이라고 한다 

우리가 사용할 유저 모델을 만들어 보자
• sequelize.define(): 모델 정의 
• sequelize.sync(): 데이터베이스 연동

모델 정의
// models.js

    const Sequelize = require('sequelize');
    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './db.sqlite'
    })

    const User = sequelize.define('User',{
        name: Sequelize.STRING
    });

    module.exports = {Sequelize, sequelize, User};

// bin/sync-db.js

    const models = require('../models');

    models.sequelize.sync({force: true}); //기존에 db가 있어라도 새로만들기

터미널에
node bin/sync-db.js 실행
-> db.sqlite 생성됨

--------------------
# 28 DB ORM 동기화

// sync-db.js

    const models = require('../models');

    module.exports = () => {
        return models.sequelize.sync({force: true}); //기존에 db가 있어라도 새로만들기
        // 리턴값이 promise를 리턴해서 비동기 처리를 완료하도록 인터페이스를 제공함
    }

// www.js

    const app = require('../index');
    const syncDB = require('./sync-db');

    // promise라서 then 사용 가능
    syncDB().then(_=> {
        console.log('Sync database!');
        app.listen(3000, () => {
            console.log('Server is running on 3000 port');
        })
    })

--------------------
# 29 API - DB 연동 ( index 컨트롤러 )


//user.spec.js 

    const models = require('../../models');

    before(()=> models.sequelize.sync({force: true})); // 동기화
    // before((done) => {// db 싱크는 비동기라서 done 필요
    //     models.sequelize.sync({force: true}).then(_=>done());
    // }) // 모카에서는 promise 보장해줘서 위와 같이 줄여쓸 수 있음

// user.ctrl.js

    const index = (req, res) => {
        req.query.limit = req.query.limit || 10; // req.query.limit의 값이 없으면 기본값 10으로
        const limit = parseInt(req.query.limit, 10); // 10w진법 정수로 변환
        if (Number.isNaN(limit)){ // 숫자가 아니면
            return res.status(400).end(); // 400을 응답
        }

        models.User.findAll({})
            .then(users => {
                res.json(users);
            })
    }

샘플 DB 넣기
//user.spec.js

    const users = [{name: 'alice'},{name: 'ben'},{name: 'chuck'}]
    before(() => models.sequelize.sync({force: true})); // 초기화
    before(() => models.User.bulkCreate(users)) // 샘플 DB 넣기

시퀄라이즈 로그 없애기
//models.js

    const sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: './db.sqlite',
        logging: false // 로그 없애기
    })

--------------------
# 30 API - DB 연동 ( show 컨트롤러 )

mocha watch 옵션 -w 붙이기
// package.json

    "scripts": {
        "test": "cross-env NODE_ENV=test mocha api/user/user.spec.js -w",
        "start": "node bin/www.js"
    },

//user.ctrl.js

    const show = (req, res) => {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)){
            return res.status(400).end();
        }
        console.log('id : ', id);
        models.User.findOne({
            where: {id}
        }).then( user => {
            if (!user) return res.status(404).end();
            res.json(user);
        })
    }

-------------------------
# 31 API - DB 연동 ( destroy 컨트롤러 )

//user.ctrl.js

    const destroy = (req,res) => {
        const id = parseInt(req.params.id, 10);
        if (Number.isNaN(id)){
            return res.status(400).end();
        }
        models.User.destroy({
            where: {id}
        }).then(() => {
            res.status(204).end();
        })
    }

-------------------------
# 32 API - DB 연동 ( create 컨트롤러 )

name 컬럼 유니크 설정
//models.js

    const User = sequelize.define('User',{
        name: {
            type: Sequelize.STRING,
            unique: true
        }
    });

각 테스트 마다 시작부분에 추가하기

    const users = [{name: 'alice'},{name: 'ben'},{name: 'chuck'}]
    before(() => models.sequelize.sync({force: true})); // 초기화
    before(() => models.User.bulkCreate(users)) // 샘플 DB 넣기

console.log(err)로 에러명 찾은 뒤 catch로 잡기
//user.ctrl.js

    const create = (req,res) => {
        const name = req.body.name;
        if (!name){
            return res.status(400).end();
        }
        
        // if (dbUsers.length > 0) return res.status(409).end();
        models.User.create({name})
            .then(user => {
                res.status(201).json(user);
            })
            .catch(err => {
                if (err.name === 'SequelizeUniqueConstraintError'){
                    return res.status(409).end();
                }
                res.status(500).end();
            }) 
    }

-------------------------
# 33 API - DB 연동 ( update 컨트롤러 )


// user.ctrl.js

    const update = (req,res) => {
        const id = parseInt(req.params.id, 10);
        const name = req.body.name;
        if (Number.isNaN(id) || !name) return res.status(400).end();

        models.User.findOne({where: {id}})
            .then(user => {
                if (!user) return res.status(404).end();

                user.name = name;
                user.save()
                    .then(user => {
                    res.json(user);
                    })
                    .catch(err => {
                        if (err.name === 'SequelizeUniqueConstraintError'){
                            return res.status(409).end();
                        }
                        res.status(500).end();
                    })
            })
    }

-------------------------
# 34 실제 서비스 일때는 데이터 유지되록

//sync-db.js

    module.exports = () => {
        const options = {
            force: process.env.NODE_ENV === 'test' ? true : false
        }
        return models.sequelize.sync(options); //기존에 db가 있어라도 새로만들기
        // 리턴값이 promise를 리턴해서 비동기 처리를 완료하도록 인터페이스를 제공함
    }

---------------------------
# 35 api 확장할 때

api 폴더 밑에 새로 만들 api폴더 만들고 그 안에 
- index.js 
- user.ctrl.js 
- user.spec.js
파일 만들고

메인index.js에
app.use('/photo',photo);
추가