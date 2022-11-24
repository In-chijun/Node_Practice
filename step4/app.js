const path = require('path');

const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const nunjucks = require('nunjucks');
const { sequelize } = require('./models');

const passport = require('passport');
const passportConfig = require('./passport'); // 해당 위치에서 index.js를 불러온 것

const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const indexRouter = require('./routes');

dotenv.config();
passportConfig();

const app = express();
app.set('port', process.env.PORT || 3000);

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

sequelize.sync({ force: false })
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

// 반드시 해줘야 하는 두 가지
app.use(passport.initialize());
app.use(passport.session());

app.use('/auth', authRouter); // /auth로 접근하면 authRouter을 호출하는 것. authRouter require는 위에 선언되어 있다.
app.use('/user', userRouter);
app.use('/comment', commentRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.locals.user = req.user;
    res.render('index');
});

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
