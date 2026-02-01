# Contributing to SorSU NSTP Service Hub

Thank you for your interest in contributing to the SorSU NSTP Service Hub! This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)

### Suggesting Enhancements

We welcome feature suggestions! Please create an issue with:
- Clear description of the enhancement
- Use case and benefits
- Potential implementation approach (optional)
- Mockups or examples (if applicable)

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/RYTZZ/sorsu-nstp-hub.git
   cd sorsu-nstp-hub
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**
   - Test all affected features
   - Ensure no existing functionality breaks
   - Test on multiple devices/browsers

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Provide clear description of changes
   - Reference related issues
   - Include screenshots if UI changes

## 📝 Coding Standards

### Backend (Node.js/Express)

```javascript
// Use async/await for asynchronous operations
async function getUserData(userId) {
  try {
    const user = await User.findByPk(userId);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
}

// Use descriptive variable and function names
const userEmail = 'user@example.com';
const isUserValid = validateUser(userEmail);

// Add error handling
exports.createConcern = async (req, res) => {
  try {
    // Implementation
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to create concern' });
  }
};
```

### Frontend (HTML/CSS/JavaScript)

```javascript
// Use ES6+ features
const loadData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Use descriptive class names (follow existing patterns)
<div class="form-group">
  <label class="form-label">Email</label>
  <input type="email" class="form-control">
</div>

// Add comments for complex logic
// Calculate GWA qualification based on 2.00 threshold
const isQualified = gwa <= 2.00;
```

### CSS

```css
/* Use CSS variables for colors */
color: var(--primary-orange);
background-color: var(--bg-primary);

/* Follow naming conventions */
.component-name { }
.component-name__element { }
.component-name--modifier { }

/* Use responsive design */
@media (max-width: 768px) {
  .component {
    /* Mobile styles */
  }
}
```

## 🏗️ Project Structure

```
sorsu-nstp-hub/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route handlers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── utils/          # Helper functions
│   └── server.js       # Main server file
├── public/
│   ├── css/           # Stylesheets
│   ├── js/            # Frontend JavaScript
│   └── images/        # Static images
└── views/             # HTML pages
```

## 🧪 Testing Guidelines

### Before Submitting PR

- [ ] Test all modified features
- [ ] Test on different browsers (Chrome, Firefox, Safari)
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Check console for errors
- [ ] Verify no broken links
- [ ] Test with different user roles (if applicable)

### Manual Testing Checklist

**Frontend:**
- All forms validate properly
- Error messages display correctly
- Success notifications work
- Navigation works smoothly
- Images and assets load

**Backend:**
- API endpoints return correct data
- Error handling works
- Authentication/authorization works
- Database operations complete successfully
- Email notifications send (if applicable)

## 📋 Commit Message Guidelines

Use clear, descriptive commit messages:

```
Add: New feature or functionality
Fix: Bug fix
Update: Changes to existing feature
Remove: Removed feature or code
Docs: Documentation changes
Style: Formatting, missing semicolons, etc.
Refactor: Code restructuring
Test: Adding or updating tests
```

Examples:
```
Add: GWA calculator with qualification popup
Fix: Email notification not sending for concerns
Update: Dashboard statistics to include new metrics
Docs: Add API endpoint documentation
```

## 🎨 Design Guidelines

### Color Palette
- Primary: `#FF6B35`, `#FF8C42`, `#FFA500`
- Secondary: `#FFFFFF`, `#F8F9FA`
- Accent: `#E55B2D`, `#FFB380`
- Text: `#333333`, `#666666`, `#999999`

### Typography
- Font: Poppins (Google Fonts)
- Headings: 700 weight
- Body: 400 weight
- Buttons: 600 weight

### Spacing
- Use consistent spacing (multiples of 0.5rem)
- Card padding: 2rem
- Section padding: 3rem vertical

### Components
- Border radius: 8px (cards), 12px (large components)
- Box shadow: Use CSS variables
- Transitions: 0.3s ease

## 🔒 Security Guidelines

- Never commit sensitive data (passwords, API keys)
- Use environment variables for configuration
- Validate all user inputs
- Sanitize data before database operations
- Use prepared statements (Sequelize ORM does this)
- Implement proper authentication checks
- Follow OWASP security best practices

## 📚 Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize ORM Documentation](https://sequelize.org/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Render Documentation](https://render.com/docs)

## 💬 Communication

- **Issues**: For bug reports and feature requests
- **Pull Requests**: For code contributions
- **Discussions**: For general questions and ideas
- **Email**: nstp@sorsu.edu.ph for direct contact

## 📄 License

By contributing, you agree that your contributions will be licensed under the ISC License.

## 🙏 Recognition

Contributors will be recognized in:
- Project README
- Release notes
- Contributors page (if implemented)

## ⚖️ Code of Conduct

### Our Standards

- Be respectful and inclusive
- Accept constructive criticism
- Focus on what's best for the project
- Show empathy towards others

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## 📞 Questions?

If you have questions about contributing:
- Check existing issues and discussions
- Create a new issue with the "question" label
- Email: nstp@sorsu.edu.ph

---

Thank you for contributing to SorSU NSTP Service Hub! 🎉
