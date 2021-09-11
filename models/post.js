const Sequelize = require('sequelize');

//게시글 모델은 게시글 내용과 이미지 경로 저장
module.exports = class Post extends Sequelize.Model{

    static init(sequelize){
        // init메소드(테이블설정) 인자1(테이블컬럼이름,속성값)
        // 인자2(테이블 생성에 필요한 기타값)
        return super.init({
            //테이블 컬럼이름,속성값
            content:{
                type:Sequelize.STRING(140),
                allowNull:false,
            },
            img:{
                type:Sequelize.STRING(200),
                allowNull:true,
            },},
            { //테이블 생성에 필요한 기타값
                sequelize,
                timestamps:true,//row가 생성,수정될때 시간자동입력
                underscored:false,
                modelName:'Post',
                tableName:'posts',//실제db의 테이블 이름
                paranoid:false,//true면 row삭제시 완전히 지워지지 않고 지운 시각 기록(나중에 복원하기 위해)
                charset:'utf8mb4', //한글 입력위해
                collate:'utf8mb4_general_ci',//한글 입력위해

            });
    } //associate에서 다른 모델과의 관계 적음
    static associate(db){
        //유저모델과 포스트 모델은 1:N
        db.Post.belongsTo(db.User);
        //포스트와 해시태그는 N:M 서로가 1:N관계임. 포스트도 여러 해쉬태그 가질수있고, 해쉬태그도 여러 포스트 가질 수 있음.
        db.Post.belongsToMany(db.Hashtag, {
            through: 'PostHashtag' //중간모델
        });

    }
};