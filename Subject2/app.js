const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');

const dotenv = require('dotenv');
const path = require('path');
// const multer = require('multer');
// const fs = require('fs');

const usersRouter = require('./routes/userInfo');
const boardRouter = require('./routes/boardInfo');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);

// 템플릿 엔진
// app.set('view engine', 'html');
// nunjucks.configure(path.join(__dirname, 'views'), {
//     express: app,
//     watch: true
// });

const PUBLIC = path.join(__dirname, 'public');

const users = {};
const postings = {};

app.use(
    morgan('dev'),
    express.static(PUBLIC),
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
    })
);

app.get('/', (_, res) => res.sendFile(path.join(PUBLIC, 'index.html')));

app.use('/userInfo', usersRouter);
app.use('/board', boardRouter);

app.listen(app.get('port'), () => console.log(`${app.get('port')} 번 포트에서 대기 중`));