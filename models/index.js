//각각의 모델들(hashtag,post,user)을
//시퀄라이즈 객체에 연결

const Sequelize = require('sequelize');
//개발로 환경 지정, 배포는 production임.
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];

//모델들 불러옴(hashtag,post,user)
const User = require('./user');
const Post = require('./post');
const Hashtag = require('./hashtag');


const db = {};

const sequelize = new Sequelize(
  config.database,config.username,
  config.password,config,
);

//모델을 시퀄라이즈 객체에 연결
//db.모델 = 
db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Hashtag = Hashtag;

User.init(sequelize);
Post.init(sequelize);
Hashtag.init(sequelize);

User.associate(db);
Post.associate(db);
Hashtag.associate(db);

module.exports =db;