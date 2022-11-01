const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');


dotenv.config();


const DIR = 'data/'
const users = {};

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


const app = express();
app.set('port', process.env.PORT || 3000);

app.use(
    morgan('dev'),
    express.static(path.join(__dirname, 'public')),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.SECRET),
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    }));

app.get('/', (_, res) => res.redirect(301, '/index.html'));
app.get('/users', (_, res) => res.send(JSON.stringify(users))) // 전체 사용자 조회 코드
app.get('/create', (_, res) => res.redirect(301, '/create.html'));
app.get('/read', (_, res) => res.redirect(301, '/read.html'));
app.get('/update', (_, res) => res.redirect(301, '/update.html'));
app.get('/delete', (_, res) => res.redirect(301, '/delete.html'));


// 사용자 정보 추가
app.post('/cid', upload.single('image'), (req, res) => {
    const { id, name, birth, gender } = req.body;
    users[id] = { name, birth, gender, 'img': req.file?.path ?? '' };
    res.redirect(301, '/index.html');
});

// 사용자 정보 조회
app.get('/rid', (req, res) => {
    const id = req?.query?.id;
    res.send(id in users ? JSON.stringify(users[id]) : `존재하지 않은 ID: ${id}`);
});

// 사용자 정보 수정
app.post('/uid', upload.single('image'), (req, res) => {
    const { id, name, birth, gender } = req.body;
    if (id in users) {
        if (req.body.name != '') {
            users[id].name = req.body.name
        }
        if (req.body.birth != '') {
            users[id].birth = req.body.birth
        }
        if (req.body.gender != null) {
            users[id].gender = req.body.gender
        }
        if (req.body.img != null) {
            users[id].img = req.file?.path
        }
        res.redirect(301, '/index.html');
    }
    else res.send(`존재하지 않은 ID: ${id}`);
});

// 사용자 정보 삭제
app.get('/did', (req, res) => {
    const id = req?.query?.id;
    id in users ? delete users[id] : res.send(`존재하지 않은 ID: ${id}`);
    res.redirect(301, '/index.html');
});

app.listen(app.get('port'), () => console.log(`${app.get('port')} 번 포트에서 대기 중`));
