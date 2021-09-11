//로그인한 사용자는 ->회원가입x,로그인x라우터에 접속하면 안됨
//로그인 안한 사용자 => 로그아웃 라우터 x접근하면 안됨


//1. 로그인 미들웨어 - page.js에서 사용할거임
//로그인 했다면,  프로필 볼수있고
exports.isLoggedIn = (req, res, next) =>{

    if(req.isAuthenticated()){
        next();
    }else{
        res.status(403).send('you need to login');
    }
};


//2. 로그인 안한 미들웨어-page.js에서 사용할거임
//로그인안했다면 회원가입 페이지 볼 수 있고
exports.isNotLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        if(!req.isAuthenticated()){
            next();
        }else{
            const message = encodeURIComponent('you are already logged in');
            res.redirect(`/?error=${message}`);
        }
    }
}