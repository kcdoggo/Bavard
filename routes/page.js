//세개의 페이지 구성할거임 
//(랜딩페이지, 가입페이지, 프로필페이지)

const express = require('express');
const router = express.Router();


//미들웨어 작성,유저,팔로워,팔로잉카운트,팔로잉하는 사람들 아이디 초기화
router.use((req,res,next)=>{
    res.locals.user = null; //모든템플릿사용이니 locals
    res.locals.followerCount = 0;
    res.locals.followingCount = 0;
    res.locals.followerIdList = [];
    next();
})

//랜딩페이지 라우터
router.get('/',(req,res,next)=>{
    res.render('landingpage',{title:'Bavard'},
   ) // /요청 받으면 landingpage.html렌더링하겠다.
})

//로그인 페이지 라우터
router.get('/login',(req,res,next)=>{
    res.render('login',{title:'login'})
})


//메인 페이지 라우터
router.get('/main', (req,res,next)=>{
    
    res.render('main',{
    title:'main', 
    nick:req.user.nick,

});
});


//회원가입 페이지 라우터
router.get('/join',(req,res,next)=>{
    res.render('join',{title:'join'})
})



module.exports = router;