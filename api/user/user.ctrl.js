var users = [
    {id: 1, name: 'alice'},
    {id: 2, name: 'ben'},
    {id: 3, name: 'chris'}
]

const index = (req, res) => {
    req.query.limit = req.query.limit || 10; // req.query.limit의 값이 없으면 기본값 10으로
    const limit = parseInt(req.query.limit, 10); // 10w진법 정수로 변환
    if (Number.isNaN(limit)){ // 숫자가 아니면
        return res.status(400).end(); // 400을 응답
    }
    res.json(users.slice(0,limit));
}
const show = (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)){
        return res.status(400).end();
    }
    const user = users.filter((user) => user.id === id)[0];
    if (!user){
        return res.status(404).end();
    }
    res.json(user);
}
const destroy = (req,res) => {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)){
        return res.status(400).end();
    }
    users = users.filter(user => user.id !== id);
    return res.status(204).end();
}
const create = (req,res) => {
    const name = req.body.name;
    if (!name){
        return res.status(400).end();
    }
    const dbUsers = users.filter((user) => user.name === name);
    if (dbUsers.length > 0){
        return res.status(409).end();
    }
    const id = Date.now();
    const user = {id,name};
    users.push(user);
    res.status(201).json(user);
}
const update = (req,res) => {
    const id = parseInt(req.params.id, 10);
    const name = req.body.name;
    if (Number.isNaN(id) || !name) return res.status(400).end();

    const isConflict = users.filter(user => user.name === name).length;
    if (isConflict) return res.status(409).end();

    const user = users.filter(user => user.id === id)[0];
    if (!user) return res.status(404).end();

    user.name = name;

    res.json(user);
}

module.exports = { //es6문법
    index,
    show,
    destroy,
    create,
    update
}