const path = require('path');

const express = require('express'); //express 모듈을 불러오는 것. 모듈은 .js파일
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
app.set('port', process.env.PORT || 3000); // env의 PORT값에 접근한다. 값은 5000. 널이면 3000

app.set('view engine', 'html');
nunjucks.configure(path.join(__dirname, 'views'), {
    express: app,
    watch: true,
});

sequelize.sync({ force: false }) // models.index에서 db를 Sequelize에 할당해주고 있다.
  .then(() => console.log('데이터베이스 연결 성공'))    // resolve함수를 호출하고 있다.
  .catch(err => console.error(err));

// 미들웨어가 순차적으로 실행된다. (req, res, next)
app.use( // use함수의 인자로 전달할 수 있는 값은 미들웨어(요청객체, 응답객체, next함수)만 가능하다. 다음 전달된 각 함수가 next를 호출하면서 다음으로 넘길 수 있다.
    morgan('dev'), //클라이언트의 요청을 기록하여 출력해주는 역할
    express.static(path.join(__dirname, 'public')), // 폴더 내의 정적을 파일들이 있으면 호출해줌. 하지만 public 폴더를 호출하고 있으니 이 코드에서는 의미가 없는 줄이라고 봐도 된다.
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

app.use('/user', userRouter); // 이 API 주소에 대해 두 번째 인자값의 라우터를 호출하라는 것.
app.use('/comment', commentRouter);
app.use('/', indexRouter);

app.use((req, res, next) => {
    res.locals.title = require('./package.json').name;
    res.locals.port = app.get('port');
    res.render('index');
});

app.use((err, req, res, next) => {
    res.sendFile();
    console.error(err);
    res.status(500).send(err);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});
