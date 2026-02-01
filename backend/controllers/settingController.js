const { Setting } = require('../models');

exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.findAll({
      order: [['key', 'ASC']]
    });

    // Convert to key-value object
    const settingsObj = {};
    settings.forEach(setting => {
      settingsObj[setting.key] = setting.value;
    });

    res.json({ settings: settingsObj });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
};

exports.getSetting = async (req, res) => {
  try {
    const { key } = req.params;

    const setting = await Setting.findOne({ where: { key } });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }

    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    console.error('Get setting error:', error);
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
};

exports.updateSetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    let setting = await Setting.findOne({ where: { key } });
    
    if (setting) {
      await setting.update({ value });
    } else {
      setting = await Setting.create({ key, value });
    }

    res.json({ message: 'Setting updated successfully', setting });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Failed to update setting' });
  }
};

exports.toggleDeadline = async (req, res) => {
  try {
    const { enabled } = req.body;

    let setting = await Setting.findOne({ where: { key: 'submissions_enabled' } });
    
    if (setting) {
      await setting.update({ value: enabled ? 'true' : 'false' });
    } else {
      setting = await Setting.create({
        key: 'submissions_enabled',
        value: enabled ? 'true' : 'false',
        description: 'Enable or disable site-wide submissions'
      });
    }

    res.json({ 
      message: 'Deadline setting updated successfully', 
      enabled: setting.value === 'true' 
    });
  } catch (error) {
    console.error('Toggle deadline error:', error);
    res.status(500).json({ error: 'Failed to toggle deadline' });
  }
};

exports.checkSubmissionStatus = async (req, res) => {
  try {
    const setting = await Setting.findOne({ where: { key: 'submissions_enabled' } });
    const enabled = setting ? setting.value === 'true' : true;

    res.json({ enabled });
  } catch (error) {
    console.error('Check submission status error:', error);
    res.status(500).json({ error: 'Failed to check submission status' });
  }
};
