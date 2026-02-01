const { News, Campus, User } = require('../models');
const cloudinary = require('../config/cloudinary');

exports.getAllNews = async (req, res) => {
  try {
    const { campusId, isPublished, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const whereClause = {};
    
    if (campusId) {
      whereClause.campusId = campusId;
    }

    // Public users only see published news
    if (!req.user || req.user.role === 'student') {
      whereClause.isPublished = true;
    } else if (isPublished !== undefined) {
      whereClause.isPublished = isPublished === 'true';
    }

    // Campus admins only see their campus news
    if (req.user && req.user.role === 'campus_admin') {
      whereClause.campusId = req.user.campusId;
    }

    const { count, rows } = await News.findAndCountAll({
      where: whereClause,
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }
      ],
      order: [['publishedAt', 'DESC'], ['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      news: rows,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.getNewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id, {
      include: [
        { model: Campus, as: 'campus', attributes: ['id', 'name', 'code'] },
        { model: User, as: 'author', attributes: ['id', 'firstName', 'lastName'] }
      ]
    });

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Only published news for non-admin users
    if ((!req.user || req.user.role === 'student') && !news.isPublished) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.json({ news });
  } catch (error) {
    console.error('Get news error:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
};

exports.createNews = async (req, res) => {
  try {
    const { title, content, campusId, isPublished } = req.body;

    // Campus admins can only create news for their campus
    let targetCampusId = campusId;
    if (req.user.role === 'campus_admin') {
      targetCampusId = req.user.campusId;
    }

    // Handle image upload if present
    let imageUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'news',
        resource_type: 'image'
      });
      imageUrl = result.secure_url;
    }

    const news = await News.create({
      title,
      content,
      imageUrl,
      campusId: targetCampusId,
      authorId: req.user.id,
      isPublished: isPublished || false,
      publishedAt: isPublished ? new Date() : null
    });

    res.status(201).json({ message: 'News created successfully', news });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Failed to create news' });
  }
};

exports.updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, isPublished } = req.body;

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Campus admins can only update their campus news
    if (req.user.role === 'campus_admin' && news.campusId !== req.user.campusId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Handle image upload if present
    let imageUrl = news.imageUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'news',
        resource_type: 'image'
      });
      imageUrl = result.secure_url;
    }

    const updateData = {
      title: title || news.title,
      content: content || news.content,
      imageUrl
    };

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
      if (isPublished && !news.publishedAt) {
        updateData.publishedAt = new Date();
      }
    }

    await news.update(updateData);

    res.json({ message: 'News updated successfully', news });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Failed to update news' });
  }
};

exports.deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findByPk(id);
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    // Campus admins can only delete their campus news
    if (req.user.role === 'campus_admin' && news.campusId !== req.user.campusId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await news.destroy();

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'Failed to delete news' });
  }
};
