//passport-kakao 모듈로 부터 Strategy생성자 불러와 전략 구현
//('passport-local').Strategy 도 있고 twitter도 있고 전략은 다양

const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

const User = require('../models/user');

module.exports = () => {

    //카카오 로그인에 대한 설정
    passport.use(new KakaoStrategy({
        //노출되지않아야하므로저렇게설정,ID발급받아.env파일에넣음
        clientID: process.env.KAKAO_ID,
        //카카오로부터인증결과받을라우터주소
        callbackURL:'/auth/kakao/callback',

    },async(accessToken,refreshToken, profile,done) =>{
        console.log('kakao profile', profile);
        try{//카카오통해회원가입한사용자있는지조회
            const exUser = await User.findOne({
                where: {snsId:profile.id, provider:'kakao'},
            });
            if(exUser){//만약사용자있음,사용자정보와함께done함수호출및전략종료
                done(null,exUser);//done함수: req.session에저장하고픈데이터
            }else{//없음,회원가입진행
            /*카카오에선인증후callbackURL에 적힌 주소로 
            accessToken,refreshToken, profile보냄.*/
                const newUser = await User.create({
                    email: profile._json&&profile._json.kakao_account_email,
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider:'kakao',
                });
                done(null, newUser);
            }
        }catch(error){
            console.error(error);
            done(error);
        }
    
    }));

};
