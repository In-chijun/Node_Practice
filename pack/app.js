const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const multer = require('multer');

const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');


dotenv.config();

const DIR = 'data/'

try { // 폴더 경로를 보고 파일이 없으면 만들어주는 작업
    fs.readdirSync(DIR);
} catch (error) {
    fs.mkdirSync(DIR);
}

const app = express();
app.set('port', process.env.PORT || 3000);

app.use(
    morgan('dev'),
    express.json(),
    express.urlencoded({ extended: false }),
    cookieParser(process.env.COOKIE_SECRET),
    session({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
            secure: false
        },
        name: 'session-cookie'
    }));

const upload = multer({ // 
    storage: multer.diskStorage({
        destination(req, file, done) { // 목적지
            done(null, DIR);
        },
        filename(req, file, done) { // 파일 이름 지정
            const ext = path.extname(file.originalname); // 확장자명을 변수에 저장
            done(null, `${req.body.id}${ext}`); // 파일 이름 재설정
        }
    })
});
    

app.use('/', express.static(path.join(__dirname, 'public')));
app.get('/', (_, res) => res.redirect(301, '/index.html'));


app.post('/upload', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send(req.body.id);
});

app.listen(app.get('port'), () => console.log(app.get('port'), '번 포트에서 대기 중'));
