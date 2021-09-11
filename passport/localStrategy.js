/** passport-local 모듈에서 Strategy
 * 생성자 불러와 그 안에 전략구현 */

 const passport = require('passport');
 const LocalStrategy = require('passport-local').Strategy;
 const bcrypt = require('bcrypt');
 
 const User = require('../models/user');
 module.exports= () => {
 
     //유저,비번필드에 req.body속성명 적기,전략에관한설정
     passport.use(new LocalStrategy({
         usernameField: 'email',
         passwordField: 'password',
 
     //done은 authenticate의 콜백함수
     },async(email,password,done)=>{
         try{                 //findOne은 sequealize데터조회
             const exUser = await User.findOne({
                 where: {email}});
                 if(exUser){
                     //DB에서일치한이메일있는지찾고,있으면bcrypt.compare함수로비번비교
                     const result = await bcrypt.compare(password,exUser.password);
                     if(result){//비번일치하면,두번째인수로 사용자정보넣어보냄.
                         done(null,exUser);
                     }else{
                         done(null,false,{message:'비번이 일치하지 않습니다'});
                     }
                 }else{
                     done(null,false,{message:'가입되지 않은 회원입니다'});
 
                 }
         }catch(error){
             console.error(error);
             done(error);
         }
     }));
 }