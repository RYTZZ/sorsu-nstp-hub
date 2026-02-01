const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Concern = sequelize.define('Concern', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  referenceNumber: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  campusId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'campuses',
      key: 'id'
    }
  },
  programId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'programs',
      key: 'id'
    }
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  concernType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  subject: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  attachmentUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'in_progress', 'resolved', 'closed'),
    defaultValue: 'pending'
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resolvedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'concerns',
  timestamps: true
});

module.exports = Concern;
