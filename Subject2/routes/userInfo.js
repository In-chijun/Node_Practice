const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');

const router = express.Router();

const PUBLIC = path.join(__dirname, 'users');

users = {}

router.get('/', (_, res) => res.sendFile(path.join(PUBLIC, 'users.html')));
router.get('/userList', (_, res) => res.send(JSON.stringify(users)))
router.get('/create', (_, res) => res.sendFile(path.join(PUBLIC, 'create.html')));
router.get('/read', (_, res) => res.sendFile(path.join(PUBLIC, 'read.html')));
router.get('/update', (_, res) => res.sendFile(path.join(PUBLIC, 'update.html')));
router.get('/delete', (_, res) => res.sendFile(path.join(PUBLIC, 'delete.html')));

router.post('/cid', (req, res) => {
    const { id, name, gender } = req.body;
    users[id] = { name, gender };
    res.sendFile(path.join(PUBLIC, 'users.html'));
});

// 사용자 정보 조회
router.get('/rid', (req, res) => {
    const id = req?.query?.id;
    res.send(id in users ? JSON.stringify(users[id]) : `존재하지 않은 ID: ${id}`);
});

// 사용자 정보 수정
router.post('/uid', (req, res) => {
    const { id, name, gender } = req.body;
    if (id in users) {
        if (name) users[id].name = name;
        if (gender) users[id].gender = gender;
    }
    res.sendFile(path.join(PUBLIC, 'users.html'));
});

// 사용자 정보 삭제
router.get('/did', (req, res) => {
    const id = req?.query?.id;
    if (id in users)
        delete users[id];
    res.sendFile(path.join(PUBLIC, 'users.html'));
});

module.exports = router;