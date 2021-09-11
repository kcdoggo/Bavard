const express = require('express');
//서버에서 동봉된 쿠키를 req.cookie객체에 담는 역할
const cookieParser = require('cookie-parser')
//http상태,메소드를 확인할 수 있음. morgan의 인수로 dev,combined(배포환경)
const morgan = require('morgan');
//정적파일(css) 경로 알려줄때, path모듈 씀
const path = require('path');
//세션 관리
const session = require('express-session');
//html 템플릿 엔진
const nunjucks = require('nunjucks')
//dotenv는 process.env를 관리 .env(쿠키시크릿)에 써져잇는 걸 관리함.
//보완에 용이, 특히 cookie secret 쿠키개인정보 보완함
const dotenv = require('dotenv');
const passport = require('passport');

dotenv.config();

//index.js는 생략가능해서 실제주소는 패스포트 폴더의 인덱스 파일임.

//router폴더의 page.js 불러옴. 라우터
const pageRouter = require('./routes/page');

const authRouter = require('./routes/auth');

//모델(user,post,hashtag)을 서버와 연결
const {sequelize} = require('./models');
const passportConfig = require('./passport');

const app = express();
passportConfig();

//app.set은 서버가 실행될 포트, PORT에 정보있으면 거길 서버로,아니면 기본3000번
app.set('port', process.env.PORT||8001)
//http 템플릿
app.set('view engine','html');

//넌적스 템플릿이 views폴더에 적용
nunjucks.configure('views',{
    express:app,
    watch:true, //html이 변경될때마다 렌더링true
});

//force:false는 drop table if table exists다 
//만약 force하면 overwritten됨
sequelize.sync({force:false})
.then(()=>{
    console.log('DB connection successful!');
}).catch((err)=>{
    console.log(err);
})


//미들웨어사용은 app.use와 쓴다.(주소없으면, 모든 요청에 이 미들웨어 실행한다는 얘기)
//http메소드,상태 볼수있음 개발환경이니 인수는 dev(배포combined)
app.use(morgan('dev'))



//정적static파일 사용, 파일경로public 위해 path모듈 사용
app.use(express.static(path.join(__dirname,'public')));


//body-parser사용, 이건 내장함수고
//json, urlencoded 데이터형태를 해석할 수 있음. text,raw도 해석가능
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(cookieParser(process.env.COOKIE_SECRET));

//세션
app.use(session({
    resave:false,
    saveUninitialized:false,
    secret: process.env.COOKIE_SECRET,
    cookie:{
        httpOnly:true, secure:false,
    },
}));


//패스포트 미들웨어 사용
//req에패스포트설정심음
app.use(passport.initialize());

//req.session에패스포트정보저장.
//세션은 세션미들웨어서 생성되니때문에 세션 미들웨어 뒤에 꼭 써야함.
app.use(passport.session());


// /요청이 들어오면 pageRouter미들웨어쓰세요
app.use('/',pageRouter)

app.use('/auth',authRouter);
//404응답 미들웨어, status로 http상태지정 404
app.use((req,res,next)=>{
    const error = new Error(`${
        req.method} ${req.url} 라우터가 없습니다`);
        error.status =404;
        next(error); //next함수에 route문자열 넣으면 다음 라우터미들웨어로 이동하고
        //그 외 인수'error'는 바로 에러처리 미들웨어로 이동..
        //이 error인수는 에러처리 미들웨어 err매개변수 됨.!!!
});

//위 404미들웨어에서 next에 error인수넣어서
//에러처리로 바로 err인수로 넘어감
//에러처리 미들웨어(매개변수 err,req,res,next 네개)
app.use((err,req,res,next)=>{
    res.locals.message = err.message;//locals쓰는 경우는 모든 템플릿 엔진에서 공통사용하는 경우
    res.locals.error = process.env.NODE_ENV !== 'production' ? err: {};
    res.status(err.status||500);//status응답http상태코드 지정
    res.render('error')//템플릿엔진 렌더링해서 응답
})

//app.set(port)에 있는 port번호를 듣겠다..app.listen(3000)
app.listen(app.get('port'),()=>{
    console.log(app.get('port'),'번 포트에서 대기중');
});