const { Campus, Program } = require('../models');

exports.getAllCampuses = async (req, res) => {
  try {
    const campuses = await Campus.findAll({
      where: { isActive: true },
      include: [{ model: Program, as: 'programs', where: { isActive: true }, required: false }],
      order: [['name', 'ASC']]
    });

    res.json({ campuses });
  } catch (error) {
    console.error('Get campuses error:', error);
    res.status(500).json({ error: 'Failed to fetch campuses' });
  }
};

exports.getCampusById = async (req, res) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findByPk(id, {
      include: [{ model: Program, as: 'programs', where: { isActive: true }, required: false }]
    });

    if (!campus) {
      return res.status(404).json({ error: 'Campus not found' });
    }

    res.json({ campus });
  } catch (error) {
    console.error('Get campus error:', error);
    res.status(500).json({ error: 'Failed to fetch campus' });
  }
};

exports.createCampus = async (req, res) => {
  try {
    const { name, code, location } = req.body;

    const existingCampus = await Campus.findOne({ where: { code } });
    if (existingCampus) {
      return res.status(400).json({ error: 'Campus code already exists' });
    }

    const campus = await Campus.create({ name, code, location });

    res.status(201).json({ message: 'Campus created successfully', campus });
  } catch (error) {
    console.error('Create campus error:', error);
    res.status(500).json({ error: 'Failed to create campus' });
  }
};

exports.updateCampus = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, isActive } = req.body;

    const campus = await Campus.findByPk(id);
    if (!campus) {
      return res.status(404).json({ error: 'Campus not found' });
    }

    await campus.update({ name, location, isActive });

    res.json({ message: 'Campus updated successfully', campus });
  } catch (error) {
    console.error('Update campus error:', error);
    res.status(500).json({ error: 'Failed to update campus' });
  }
};

exports.deleteCampus = async (req, res) => {
  try {
    const { id } = req.params;

    const campus = await Campus.findByPk(id);
    if (!campus) {
      return res.status(404).json({ error: 'Campus not found' });
    }

    await campus.destroy();

    res.json({ message: 'Campus deleted successfully' });
  } catch (error) {
    console.error('Delete campus error:', error);
    res.status(500).json({ error: 'Failed to delete campus' });
  }
};

// Program methods
exports.getProgramsByCampus = async (req, res) => {
  try {
    const { campusId } = req.params;

    const programs = await Program.findAll({
      where: { campusId, isActive: true },
      order: [['name', 'ASC']]
    });

    res.json({ programs });
  } catch (error) {
    console.error('Get programs error:', error);
    res.status(500).json({ error: 'Failed to fetch programs' });
  }
};

exports.createProgram = async (req, res) => {
  try {
    const { name, code, campusId } = req.body;

    const campus = await Campus.findByPk(campusId);
    if (!campus) {
      return res.status(400).json({ error: 'Invalid campus' });
    }

    const existingProgram = await Program.findOne({ where: { code, campusId } });
    if (existingProgram) {
      return res.status(400).json({ error: 'Program code already exists for this campus' });
    }

    const program = await Program.create({ name, code, campusId });

    res.status(201).json({ message: 'Program created successfully', program });
  } catch (error) {
    console.error('Create program error:', error);
    res.status(500).json({ error: 'Failed to create program' });
  }
};

exports.updateProgram = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, isActive } = req.body;

    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    await program.update({ name, isActive });

    res.json({ message: 'Program updated successfully', program });
  } catch (error) {
    console.error('Update program error:', error);
    res.status(500).json({ error: 'Failed to update program' });
  }
};

exports.deleteProgram = async (req, res) => {
  try {
    const { id } = req.params;

    const program = await Program.findByPk(id);
    if (!program) {
      return res.status(404).json({ error: 'Program not found' });
    }

    await program.destroy();

    res.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Delete program error:', error);
    res.status(500).json({ error: 'Failed to delete program' });
  }
};
