const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const nunjucks = require('nunjucks');
const { sequelize } = require('./models');

const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const indexRouter = require('./routes');

dotenv.config();

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })    // resolve함수를 호출하고 있다.
  .then(() => console.log('데이터베이스 연결 성공'))
  .catch(err => console.error(err));

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

app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.render('index');
});

app.use((err, req, res, next) => {
    res.sendFile()
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
