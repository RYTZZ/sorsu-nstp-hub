const jwt = require('jsonwebtoken');
const { User, Campus, Program } = require('../models');

exports.register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, campusId, programId, studentId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Validate campus and program if provided
    if (campusId) {
      const campus = await Campus.findByPk(campusId);
      if (!campus) {
        return res.status(400).json({ error: 'Invalid campus' });
      }
    }

    if (programId) {
      const program = await Program.findByPk(programId);
      if (!program) {
        return res.status(400).json({ error: 'Invalid program' });
      }
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
      role: role || 'student',
      campusId,
      programId,
      studentId
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        campusId: user.campusId,
        programId: user.programId
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { email },
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: Program, as: 'program', attributes: ['id', 'name', 'code'] }
      ]
    });

    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        campus: user.campus,
        program: user.program
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: Program, as: 'program', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, studentId } = req.body;
    
    await req.user.update({
      firstName: firstName || req.user.firstName,
      lastName: lastName || req.user.lastName,
      studentId: studentId || req.user.studentId
    });

    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: Program, as: 'program', attributes: ['id', 'name', 'code'] }
      ]
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};
