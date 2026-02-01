const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Program = sequelize.define('Program', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  code: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  campusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'campuses',
      key: 'id'
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'programs',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['code', 'campusId']
    }
  ]
});

module.exports = Program;
