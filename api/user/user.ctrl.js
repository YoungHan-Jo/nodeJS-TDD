const models = require('../../models');

const index = (req, res) => {
    req.query.limit = req.query.limit || 10; // req.query.limit의 값이 없으면 기본값 10으로
    const limit = parseInt(req.query.limit, 10); // 10w진법 정수로 변환
    if (Number.isNaN(limit)){ // 숫자가 아니면
        return res.status(400).end(); // 400을 응답
    }

    models.User
        .findAll({
            limit
        })
        .then(users => {
            res.json(users);
        })
}
const show = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)){
        return res.status(400).end();
    }
    models.User.findOne({
        where: {id}
    }).then( user => {
        if (!user) return res.status(404).end();
        res.json(user);
    })
}
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


module.exports = { //es6문법
    index,
    show,
    destroy,
    create,
    update
}