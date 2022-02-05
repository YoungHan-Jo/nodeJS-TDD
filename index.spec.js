const request = require('superTest');
const should = require('should')
const app = require('./index');
const res = require('express/lib/response');


describe('GET /users는 ', () => {
    describe('성공시', () => {
        it('유저 객체를 담은 배열로 응답한다.', (done) => {
            request(app)
                .get('/users')
                .end((err,res) => {
                    res.body.should.be.instanceOf(Array);
                    done();
                })
        });
        it('최대 limit 갯수만큼 응답한다. ', (done) => {
            request(app)
                .get('/users?limit=2')
                .end((err,res) => {
                    res.body.should.have.lengthOf(2);
                    done();
                })
        })
    });
    describe('실패시', () => {
        it('limit이 숫자형이 아니면 400을 응답한다. ', (done) => {
            request(app)
                .get('/users?limit=two')
                .expect(400) // 상태코드는 굳이 res객체로 should.be를 사용하지 않아도됨
                .end(done); // done만 있으면 이렇게 줄여서 쓸 수 있음
        })
    })
});

describe('GET /user/1은 ', () => {
    describe('성공시', () => {
        it('id가 1인 유저 객체를 반환한다', (done) => {
            request(app)
                .get('/user/1')
                .end((err,res) => {
                    res.body.should.have.property('id', 1); // 객체의 id 가 1이어야한다.
                    done();
                })
        })
    });
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
});

describe('DELETE /user/1은', () => {
    describe('성공시', () => {
        it('204를 응답한다.', (done) => {
            request(app)
                .delete('/user/1')
                .expect(204)
                .end(done);
        })
    })
    describe('실패시', () => {
        it('id가 숫자가 아닐경우 400으로 응답한다.', (done) => {
            request(app)
                .delete('/user/one')
                .expect(400)
                .end(done);
        })
    })
})

describe('POST /user', () => {
    describe('성공시', () => {
        let name = 'daniel',
            body;
        before(done=>{
            request(app)
                .post('/user')
                .send({name}) // ES6 문법으로 name: 'danial'로 입력됨
                .expect(201)
                .end((err, res) => {
                    body = res.body;
                    done();
                })
        })
        // it('201 상태코드를 반환한다.', (done) => {
        //     request(app)
        //         .post('/user')
        //         .send({name: 'daniel'})
        //         .expect(201)
        //         .end(done);
        // })
        it('생성된 유저 객체를 반환한다.', () => { // 비동기가 아니라서 done 빼기
            body.should.have.property('id');
        });
        it('입력한 name을 반환한다.', () =>{
            body.should.have.property('name', name);
        })
    })
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
})