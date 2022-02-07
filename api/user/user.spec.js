const request = require('superTest');
const should = require('should')
const app = require('../../');
const models = require('../../models');

describe('GET /users', () => {
    const users = [{name: 'alice'},{name: 'ben'},{name: 'chuck'}]
    before(() => models.sequelize.sync({force: true})); // 초기화
    before(() => models.User.bulkCreate(users)) // 샘플 DB 넣기
    // before((done) => {// db 싱크는 비동기라서 done 필요
    //     models.sequelize.sync({force: true}).then(_=>done());
    // }) // 모카에서는 promise 보장해줘서 위와 같이 줄여쓸 수 있음
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

describe('GET /users/:id', () => {
    const users = [{name: 'alice'},{name: 'ben'},{name: 'chuck'}]
    before(() => models.sequelize.sync({force: true})); // 초기화
    before(() => models.User.bulkCreate(users)) // 샘플 DB 넣기
    describe('성공시', () => {
        it('id가 1인 유저 객체를 반환한다', (done) => {
            request(app)
                .get('/users/1')
                .end((err,res) => {
                    res.body.should.have.property('id', 1); // 객체의 id 가 1이어야한다.
                    done();
                })
        })
    });
    describe('실패시', () => {
        it('id가 숫자가 아닐경우 400으로 응답한다. ', (done) => {
            request(app)
                .get('/users/one')
                .expect(400)
                .end(done);
        });
        it('id로 유저를 찾을 수 없을 경우 404로 응답한다.', (done) => {
            request(app)
                .get('/users/999')
                .expect(404)
                .end(done);
        })
    })
});

describe('DELETE /user/:id', () => {
    const users = [{name: 'alice'},{name: 'ben'},{name: 'chuck'}]
    before(() => models.sequelize.sync({force: true})); // 초기화
    before(() => models.User.bulkCreate(users)) // 샘플 DB 넣기
    describe('성공시', () => {
        it('204를 응답한다.', (done) => {
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done);
        })
    })
    describe('실패시', () => {
        it('id가 숫자가 아닐경우 400으로 응답한다.', (done) => {
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done);
        })
    })
})

describe('POST /user', () => {
    const users = [{name: 'alice'},{name: 'ben'},{name: 'chuck'}]
    before(() => models.sequelize.sync({force: true})); // 초기화
    before(() => models.User.bulkCreate(users)) // 샘플 DB 넣기
    describe('성공시', () => {
        let name = 'daniel',
            body;
        before(done=>{
            request(app)
                .post('/users')
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
                .post('/users')
                .send({})
                .expect(400)
                .end(done);
        })
        it('name이 중복일 경우 409를 반환한다.', (done) => {
            request(app)
                .post('/users')
                .send({name: 'daniel'})
                .expect(409)
                .end(done);
        })
    })
})

describe('PUT /user/:id', () => {
    const users = [{name: 'alice'},{name: 'ben'},{name: 'chuck'}]
    before(() => models.sequelize.sync({force: true})); // 초기화
    before(() => models.User.bulkCreate(users)) // 샘플 DB 넣기

    describe('성공시', () => {
        it('변경된 name을 응답한다.', (done) => {
            const name = 'charles';
            request(app)
                .put('/users/3')
                .send({name})
                .end((err,res) => {
                    res.body.should.have.property('name', name);
                    done();
                })
        })
    })
    describe('실패시', () => {
        const name = 'charles';
        it('정수가 아닌 id일 경우 400 응답', (done) => {
            request(app)
                .put('/users/three')
                .send({name})
                .expect(400)
                .end(done);
        })
        it('name이 없을 경우 400 응답', (done) => {
            request(app)
                .put('/users/3')
                .send({})
                .expect(400)
                .end(done);
        })
        it('없는 유저일 경우 404 응답', (done) => {
            request(app)
                .put('/users/999')
                .send({name : 'foo'})
                .expect(404)
                .end(done);
        })
        it('이름이 중복일 경우 409 응답', (done) => {
            request(app)
                .put('/users/3')
                .send({name : 'ben'})
                .expect(409)
                .end(done);
        })
    })
})