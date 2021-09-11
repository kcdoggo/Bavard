const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const {isLoggedIn, isNotLoggedIn} = require('./middlewares');

//유저 DB테이블
const User = require('../models/user');


const router = express.Router();

//회원가입 라우터.. 밖에선 /auth/join 임.
router.post('/join',async(req,res,next)=>{
    //req.body ->키,밸류가 담긴 객체,json객체접근가능.
    const {email,nick,password} = req.body;
    try{
        //가입전 유저있는지 체크(시퀄라이즈findOne)
        const exUser = await User.findOne({
            where:{email}});
            if(exUser){
                return res.redirect('/join?error=exist');
            }
            //기존유저없으면 유저 만들고 디비저장.
            //bcrypt.hash이용 비번 암호화 
            const hash = await bcrypt.hash(password,12);
            
            //User.create 시퀄라이즈로 유저 생성(이메일,닉네임,패스워드 저장)
            await User.create({
                email,nick,password:hash,
            });//회원가입됬으면 메인으로 리다이렉트
            return res.redirect('/login');
    }catch(error){
        console.error(error);
        return next(error);
    }   
});

//로그인 라우터 밖에선 /auth/login 임.
router.post('/login',(req,res,next)=>{
    //passport/local strategy.js 전략수행함 이 로컬이.
    passport.authenticate('local',(authError,user,info)=>{
        //인증에 오류있을때 if
        if(authError){
            console.error(authError);
            return next(authError);
        }//유저정보 없을때 if
        if(!user){
            return res.redirect(`/?loginError=${info.message}`);
        }
        return req.login(user,(loginError)=>{
            if(loginError){
                console.error(loginError);
                return next(loginError);
            }
            return res.redirect('/main');
        });
    })(req,res,next);
});


//로그아웃 라우터/ 밖에선 /auth/logout 임.
router.get('/logout',isLoggedIn,(req,res)=>{
    req.logout();
    req.session.destroy();
    res.redirect('/');
});

//passport/kakaoStrategy수행함.
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao',{
    failureRedirect:'/',
}),(req,res)=>{
    res.redirect('/main');
});
router.get('/google', passport.authenticate('google',{scope:['profile','email']}));

router.get('/google/callback', passport.authenticate('google',{
    failureRedirect:'/',
}),(req,res)=>{
    res.redirect('/main');
});



module.exports = router;