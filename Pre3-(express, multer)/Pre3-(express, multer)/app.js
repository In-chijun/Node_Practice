const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// https://github.com/expressjs/multer
const multer = require('multer');


dotenv.config();


const DIR = 'data/'

try {
    fs.readdirSync(DIR);
} catch (error) {
    fs.mkdirSync(DIR);
}


const app = express();
app.set('port', process.env.PORT || 5000);

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
app.get('/upload', (_, res) => res.redirect(301, '/upload.html'));
app.get('/uploads1', (_, res) => res.redirect(301, '/uploads1.html'));
app.get('/uploads2', (_, res) => res.redirect(301, '/uploads2.html'));

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, DIR);
        },
        filename(req, file, done) {
            done(null, file.originalname);
        }
    })
});

app.post('/upload', upload.single('file'), (req, res) => {
    res.send(req.file);
});

// 미들웨어 안에 미들웨어
app.post('/uploads1', (req, res, next) => {
    upload.array('files', 3)(req, res, next);
}, (req, res) => res.send(req.files));

app.post('/uploads2', (req, res, next) => {
    multer({
        storage: multer.diskStorage({
            destination(req, file, done) {
                done(null, DIR);
            }
        })
    }).fields( [{ name: 'files1', maxCount: 1 }, { name: 'files2', maxCount: 2 }] )(req, res, next);
}, (req, res) => res.send(req.files));

app.listen(app.get('port'), () => console.log(`${app.get('port')} 번 포트에서 대기 중`));
