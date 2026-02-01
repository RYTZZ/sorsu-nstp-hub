const { GWASubmission, Campus, Program, User } = require('../models');
const { generateUniqueReferenceNumber } = require('../utils/referenceNumber');
const { sendGWAConfirmation } = require('../utils/email');
const cloudinary = require('../config/cloudinary');

// GWA qualification threshold
const GWA_QUALIFICATION_THRESHOLD = 2.00;

exports.calculateGWA = async (req, res) => {
  try {
    const { gwa } = req.body;

    if (!gwa || gwa < 1.0 || gwa > 5.0) {
      return res.status(400).json({ error: 'Invalid GWA value' });
    }

    const isQualified = parseFloat(gwa) <= GWA_QUALIFICATION_THRESHOLD;

    res.json({
      gwa: parseFloat(gwa),
      isQualified,
      message: isQualified 
        ? 'Qualified for Top 10 Evaluation' 
        : 'Disqualified from Top 10 Evaluation',
      threshold: GWA_QUALIFICATION_THRESHOLD
    });
  } catch (error) {
    console.error('Calculate GWA error:', error);
    res.status(500).json({ error: 'Failed to calculate GWA' });
  }
};

exports.submitGWA = async (req, res) => {
  try {
    const {
      campusId,
      programId,
      studentId,
      firstName,
      lastName,
      email,
      gwa,
      academicYear,
      semester
    } = req.body;

    // Validate campus
    const campus = await Campus.findByPk(campusId);
    if (!campus) {
      return res.status(400).json({ error: 'Invalid campus' });
    }

    // Validate program
    const program = await Program.findByPk(programId);
    if (!program) {
      return res.status(400).json({ error: 'Invalid program' });
    }

    // Check GWA qualification
    const isQualified = parseFloat(gwa) <= GWA_QUALIFICATION_THRESHOLD;

    // Generate unique reference number
    const referenceNumber = await generateUniqueReferenceNumber(GWASubmission);

    // Handle file upload if present
    let proofUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'gwa_proofs',
        resource_type: 'image'
      });
      proofUrl = result.secure_url;
    }

    const submission = await GWASubmission.create({
      referenceNumber,
      userId: req.user?.id,
      campusId,
      programId,
      studentId,
      firstName,
      lastName,
      email,
      gwa: parseFloat(gwa),
      isQualified,
      academicYear,
      semester,
      proofUrl,
      status: 'pending'
    });

    // Send confirmation email
    await sendGWAConfirmation(submission);

    res.status(201).json({
      message: 'GWA submitted successfully',
      referenceNumber: submission.referenceNumber,
      isQualified,
      submission
    });
  } catch (error) {
    console.error('Submit GWA error:', error);
    res.status(500).json({ error: 'Failed to submit GWA' });
  }
};

exports.getGWAByReference = async (req, res) => {
  try {
    const { referenceNumber } = req.params;

    const submission = await GWASubmission.findOne({
      where: { referenceNumber },
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: Program, as: 'program', attributes: ['id', 'name', 'code'] }
      ]
    });

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get GWA error:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
};

exports.getAllGWASubmissions = async (req, res) => {
  try {
    const { campusId, status, isQualified, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    // Campus admins can only see their campus submissions
    if (req.user.role === 'campus_admin') {
      whereClause.campusId = req.user.campusId;
    } else if (campusId) {
      whereClause.campusId = campusId;
    }

    if (status) {
      whereClause.status = status;
    }

    if (isQualified !== undefined) {
      whereClause.isQualified = isQualified === 'true';
    }

    const { count, rows } = await GWASubmission.findAndCountAll({
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
      submissions: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get all GWA submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
};

exports.updateGWASubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    const submission = await GWASubmission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    // Check campus access
    if (req.user.role === 'campus_admin' && submission.campusId !== req.user.campusId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updateData = {};
    if (status) updateData.status = status;
    if (adminNotes) updateData.adminNotes = adminNotes;

    await submission.update(updateData);

    const updatedSubmission = await GWASubmission.findByPk(id, {
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: Program, as: 'program', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json({ message: 'Submission updated successfully', submission: updatedSubmission });
  } catch (error) {
    console.error('Update GWA submission error:', error);
    res.status(500).json({ error: 'Failed to update submission' });
  }
};
