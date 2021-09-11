const Sequelize = require('sequelize');

//mySQL에 user테이블 만들기.
//사용자 모델 - 로그인
module.exports = class User extends Sequelize.Model{

    //이메일,닉네임,비번,프로바이더,sns아이디
    static init(sequelize){
        return super.init({
            //users테이블 안의 필드들의 타입 정의
            email:{
                type:Sequelize.STRING(40),
                allowNull:true,
                unique:true,
            },
            nick:{
                type:Sequelize.STRING(15),
                allowNull:false, //null값이 되면 안됨.
            },
            password:{
                type:Sequelize.STRING(100),
                allowNull:true,
            },
            provider:{
                type:Sequelize.STRING(10),
                allowNull:false,
                //프로바이더가 kakao나 google일수도 있음.
                defaultValue:'local',
            },
            snsId:{
                type:Sequelize.STRING(30),
                allowNull:true,
            },
        },{
            sequelize,
            timestamps:true,
            underscored:false,//카멜케이스 다 언더스코어로
            modelName:'User',
            //테이블네임 복수형,실제 DB테이블명, users테이블 안에 위에서 정의한
            //여러 필드email,nick,password등이 들어감.
            tableName:'users', 
            paranoid:true,//createdAt,updatedAt,deletedAt컬럼생성
            charset:'utf8', //한글 
            collate:'utf8_general_ci',
            
        });
    } //associate안에 모델(hashtag,index,post,user)
    //간의 관계정의
    static associate(db){
        //1:N 유저-포스트 관계 hasMany
        //user.getPosts, addPosts 관계메서드 생성됨
        db.User.hasMany(db.Post);

        //같은유저모델끼리 N:M관계
        //유저가 많은 팔로워를 가짐
        db.User.belongsToMany(db.User,{
            foreignKey : 'followingId',
            as: 'Followers',//as는 외래키와 반대모델 가르킴
            /*모델이름이 UserUSer은 안되니까, 
            Follow로 정함.같은 모델끼리에선 모델이름 새로정해야 함.
            왜? 팔로워를 찾으려면 팔로잉 아이디 찾아야하니*/
            through: 'Follow',

        });



        //한유저가 여러명 팔로잉
        db.User.belongsToMany(db.User,{
            foreignKey: 'followerId',
            as:'Followings',
            through:'Follow',
        });


    };
}