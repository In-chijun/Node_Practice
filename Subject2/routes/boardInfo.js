const express = require('express');
const bcrypt = require('bcrypt');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const router = express.Router();

const PUBLIC = path.join(__dirname, 'board');

users = {}
postings = {}
const DIR = 'data/'

try {
    fs.readdirSync(DIR);
} catch (error) {
    fs.mkdirSync(DIR);
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, DIR);
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, `${req.body.id}${ext}`);
        }
    })
});

router.get('/', (_, res) => res.sendFile(path.join(PUBLIC, 'index.html')));
router.get('/postings', (_, res) => res.send(JSON.stringify(postings)));
router.get('/create', (_, res) => res.sendFile(path.join(PUBLIC, 'create.html')));
router.get('/read', (_, res) => res.sendFile(path.join(PUBLIC, 'read.html')));
router.get('/update', (_, res) => res.sendFile(path.join(PUBLIC, 'update.html')));
router.get('/delete', (_, res) => res.sendFile(path.join(PUBLIC, 'delete.html')));
router.get('/uploads', (_, res) => res.sendFile(path.join(PUBLIC, 'albumUploads.html')));

// 게시글 등록
router.post('/cid', (req, res) => {
    const { id, title, content } = req.body;
        postings[id] = { title, content };
        res.sendFile(path.join(PUBLIC, 'index.html'));
});

// 특정 게시글 조회
router.get('/rid', (req, res) => {
    const id = req?.query?.id;
    res.send(id in postings ? JSON.stringify(postings[id]) : `존재하지 않은 ID: ${id}`);
});

// 게시글 수정
router.post('/uid', (req, res) => {
    const { id, title, content } = req.body;
    if (id in postings) {
        if (title) postings[id]['title'] = title;
        if (content) postings[id]['content'] = content;
        res.sendFile(path.join(PUBLIC, 'index.html'));
    }
    else res.send(`존재하지 않은 ID: ${id}`);
});

// 게시글 삭제
router.get('/did', (req, res) => {
    const id = req?.query?.id;
    if (id in postings) {
        delete postings[id];
        res.sendFile(path.join(PUBLIC, 'index.html'));
    }
    else {
        res.send(`존재하지 않은 ID: ${id}`);
    }
})

// 사진 업로드
router.post('/uploads', (req, res, next) => {
    const {id} = req.body;
    if (id in postings) {
        res.status(404).send('중복된 ID입니다.')
    }
    else {
        postings[id] = {'img' : req.file?.path ?? '' };
        upload.array('files', 10)(req, res, next);
    }
}, (req, res) => res.send(req.files));

module.exports = router;