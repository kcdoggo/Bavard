//mysql 에 hashtag 테이블 생성
//태그 이름 저장- 나중에 태그검색하기 위해

const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model{

    static init(sequelize){
        return super.init({

            //hashtag테이블의 필드들 정의
            title:{
                type:Sequelize.STRING(15),
                allowNull:false,
                unique:true,
            },
        },{
            sequelize,
            timestamps:true,//row가 생성,수정될때 시간자동입력
            underscored:false,
            modelName:'Hashtag',
            tableName:'hashtags',//실제db의 테이블 이름
            paranoid:false,//true면 row삭제시 완전히 지워지지 않고 지운 시각 기록(나중에 복원하기 위해)
            charset:'utf8mb4', //한글 입력위해
            collate:'utf8mb4_general_ci',//한글 입력위해
    }); 

}
    static associate(db){
        db.Hashtag.belongsToMany(db.Post,{
            //포스트와 해시태그는 서로 N:M이니 중간모델 추가
            through:'PostHashtag'
        });
    }
};