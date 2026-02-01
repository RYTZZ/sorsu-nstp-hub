const { Concern, Campus, Program, User } = require('../models');
const { generateUniqueReferenceNumber } = require('../utils/referenceNumber');
const { sendConcernConfirmation } = require('../utils/email');
const cloudinary = require('../config/cloudinary');

exports.createConcern = async (req, res) => {
  try {
    const { campusId, programId, name, email, concernType, subject, message } = req.body;

    // Validate campus
    const campus = await Campus.findByPk(campusId);
    if (!campus) {
      return res.status(400).json({ error: 'Invalid campus' });
    }

    // Generate unique reference number
    const referenceNumber = await generateUniqueReferenceNumber(Concern);

    // Handle file upload if present
    let attachmentUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'concerns',
        resource_type: 'auto'
      });
      attachmentUrl = result.secure_url;
    }

    const concern = await Concern.create({
      referenceNumber,
      userId: req.user?.id,
      campusId,
      programId,
      name,
      email,
      concernType,
      subject,
      message,
      attachmentUrl,
      status: 'pending',
      priority: 'medium'
    });

    // Send confirmation email
    await sendConcernConfirmation(concern);

    res.status(201).json({
      message: 'Concern submitted successfully',
      referenceNumber: concern.referenceNumber,
      concern
    });
  } catch (error) {
    console.error('Create concern error:', error);
    res.status(500).json({ error: 'Failed to submit concern' });
  }
};

exports.getConcernByReference = async (req, res) => {
  try {
    const { referenceNumber } = req.params;

    const concern = await Concern.findOne({
      where: { referenceNumber },
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: Program, as: 'program', attributes: ['id', 'name', 'code'] }
      ]
    });

    if (!concern) {
      return res.status(404).json({ error: 'Concern not found' });
    }

    res.json({ concern });
  } catch (error) {
    console.error('Get concern error:', error);
    res.status(500).json({ error: 'Failed to fetch concern' });
  }
};

exports.getAllConcerns = async (req, res) => {
  try {
    const { campusId, status, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    // Campus admins can only see their campus concerns
    if (req.user.role === 'campus_admin') {
      whereClause.campusId = req.user.campusId;
    } else if (campusId) {
      whereClause.campusId = campusId;
    }

    if (status) {
      whereClause.status = status;
    }

    const { count, rows } = await Concern.findAndCountAll({
      where: whereClause,
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: Program, as: 'program', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'user', attributes: ['id', 'firstName', 'lastName', 'email'] }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      concerns: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all concerns error:', error);
    res.status(500).json({ error: 'Failed to fetch concerns' });
  }
};

exports.updateConcern = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, priority, adminNotes } = req.body;

    const concern = await Concern.findByPk(id);
    if (!concern) {
      return res.status(404).json({ error: 'Concern not found' });
    }

    // Check campus access
    if (req.user.role === 'campus_admin' && concern.campusId !== req.user.campusId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (priority) updateData.priority = priority;
    if (adminNotes) updateData.adminNotes = adminNotes;
    if (status === 'resolved') updateData.resolvedAt = new Date();

    await concern.update(updateData);

    const updatedConcern = await Concern.findByPk(id, {
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: Program, as: 'program', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json({ message: 'Concern updated successfully', concern: updatedConcern });
  } catch (error) {
    console.error('Update concern error:', error);
    res.status(500).json({ error: 'Failed to update concern' });
  }
};

exports.deleteConcern = async (req, res) => {
  try {
    const { id } = req.params;

    const concern = await Concern.findByPk(id);
    if (!concern) {
      return res.status(404).json({ error: 'Concern not found' });
    }

    // Only super admin can delete
    if (req.user.role !== 'super_admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    await concern.destroy();
    res.json({ message: 'Concern deleted successfully' });
  } catch (error) {
    console.error('Delete concern error:', error);
    res.status(500).json({ error: 'Failed to delete concern' });
  }
};
