const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GWASubmission = sequelize.define('GWASubmission', {
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
    allowNull: false,
    references: {
      model: 'programs',
      key: 'id'
    }
  },
  studentId: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false
  },
  gwa: {
    type: DataTypes.DECIMAL(4, 2),
    allowNull: false,
    validate: {
      min: 1.00,
      max: 5.00
    }
  },
  isQualified: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  academicYear: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  semester: {
    type: DataTypes.ENUM('1st', '2nd', 'summer'),
    allowNull: false
  },
  proofUrl: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'verified', 'rejected'),
    defaultValue: 'pending'
  },
  adminNotes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'gwa_submissions',
  timestamps: true
});

module.exports = GWASubmission;
