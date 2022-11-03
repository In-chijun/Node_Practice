const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');

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
    })
);

app.get('/error', (req, res, next) => {
    next('일부러 만든 에러'); //next함수 안에 문자열이 있으면 err처리 미들웨어로 넘어간다.
});

app.use((req, res, next) => {
    console.log('Middleware!');
    next();
});

app.post('/info/message', (req, res, next) => {
    const msg = `Info-Message: ${req.body.msg}`;
    console.log(msg);
    res.send(msg);
});

app.get('/info/:id', (req, res, next) => { //:id로 :이 붙었기 때문에 info/ 뒤에 아무 값이나 넣어도 Info-ID: 입력값으로 출력된다.
    const msg = `Info-ID: ${req.params.id}`;
    console.log(msg);
    res.send(msg);
});

app.use((req, res, next) => {
    next('Not found error!')
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

// use는 모든 요청을 수행한다.