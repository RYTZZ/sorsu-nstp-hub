const Campus = require('./Campus');
const Program = require('./Program');
const User = require('./User');
const Concern = require('./Concern');
const GWASubmission = require('./GWASubmission');
const News = require('./News');
const Setting = require('./Setting');

// Define relationships

// Campus has many Programs
Campus.hasMany(Program, { foreignKey: 'campusId', as: 'programs' });
Program.belongsTo(Campus, { foreignKey: 'campusId', as: 'campus' });

// Campus has many Users
Campus.hasMany(User, { foreignKey: 'campusId', as: 'users' });
User.belongsTo(Campus, { foreignKey: 'campusId', as: 'campus' });

// Program has many Users
Program.hasMany(User, { foreignKey: 'programId', as: 'users' });
User.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

// Campus has many Concerns
Campus.hasMany(Concern, { foreignKey: 'campusId', as: 'concerns' });
Concern.belongsTo(Campus, { foreignKey: 'campusId', as: 'campus' });

// User has many Concerns
User.hasMany(Concern, { foreignKey: 'userId', as: 'concerns' });
Concern.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Program has many Concerns
Program.hasMany(Concern, { foreignKey: 'programId', as: 'concerns' });
Concern.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

// Campus has many GWASubmissions
Campus.hasMany(GWASubmission, { foreignKey: 'campusId', as: 'gwaSubmissions' });
GWASubmission.belongsTo(Campus, { foreignKey: 'campusId', as: 'campus' });

// User has many GWASubmissions
User.hasMany(GWASubmission, { foreignKey: 'userId', as: 'gwaSubmissions' });
GWASubmission.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Program has many GWASubmissions
Program.hasMany(GWASubmission, { foreignKey: 'programId', as: 'gwaSubmissions' });
GWASubmission.belongsTo(Program, { foreignKey: 'programId', as: 'program' });

// Campus has many News
Campus.hasMany(News, { foreignKey: 'campusId', as: 'news' });
News.belongsTo(Campus, { foreignKey: 'campusId', as: 'campus' });

// User has many News (as author)
User.hasMany(News, { foreignKey: 'authorId', as: 'newsArticles' });
News.belongsTo(User, { foreignKey: 'authorId', as: 'author' });

module.exports = {
  Campus,
  Program,
  User,
  Concern,
  GWASubmission,
  News,
  Setting
};
