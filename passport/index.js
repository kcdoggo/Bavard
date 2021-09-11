/*이 index파일에선 serialize와 deserialize를 
 적을거임. passport의 두 핵심기능!!!
 시리얼라이즈는 로그인시 실행되고, req.session에 
 저장하고 싶은 데이터를 정하는 역할을 함
 디시리얼라이즈는 매 요칭시마다 실행되고,
 시리얼라이즈에서 받은 데이터를 매개변수로 삼아
 DB에서 사용자 조회해서 정보를 req.user에 저장하여
 앞으로 사용자 정보를 그곳에서 얻어옴 */

 const passport = require('passport');
 const local = require('./localStrategy');
 //passport/kakaoStrategy.js파일 불러옴.
 const kakao = require('./kakaoStrategy');
 const google = require('./googleStrategy');
 const { User }  = require('../models');

 /*시리얼라이즈: 로그인시 실행되고, req.session에 
 저장하고 싶은 데이터를 정하는 역할을 함*/
 module.exports = () => {
     passport.serializeUser((user,done)=>{
//첫번째인수는 오류시사용,
//두번째는req.session에저장하고픈데이터
         done(null,user.id);
     });
     passport.deserializeUser((id, done) => {

     User.findOne({
        where: { id },
        include: [{
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followers',
        }, {
          model: User,
          attributes: ['id', 'nick'],
          as: 'Followings',
        }],
      })
        .then(user => done(null, user))
        .catch(err => done(err));
    });
  

    local();
    kakao();
    google();
 
    };