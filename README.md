# SorSU NSTP Service Hub

This repository contains the complete source code for the SorSU NSTP Service Hub System, a full-stack web application designed to manage the National Service Training Program (NSTP) operations across all four campuses of Sorsogon State University.

## 🎓 Overview

The SorSU NSTP Service Hub is a comprehensive platform that enables:
- **Multi-Campus Management**: Support for Sorsogon, Bulan, Castilla, and Magallanes campuses
- **Student Services**: GWA calculation, concern reporting, and status tracking
- **Admin Dashboard**: Role-based access for Super Admins and Campus Admins
- **Real-time Notifications**: Email alerts for submissions and updates
- **Secure Operations**: JWT authentication and data privacy compliance

## 🚀 Features

### For Students
- **Report Concerns**: Submit inquiries and concerns with file attachments
- **GWA Calculator**: Calculate GWA and check Top 10 eligibility (threshold: 2.00)
- **Track Status**: Monitor submissions using reference numbers
- **NSTP Information**: Learn about NSTP components and requirements

### For Administrators
- **Campus Management**: Super Admins manage all campuses
- **Program Management**: Configure programs per campus
- **Concern Management**: Review and respond to student submissions
- **GWA Verification**: Approve or reject GWA submissions
- **News & Announcements**: Publish updates for students
- **Deadline Controls**: Enable/disable submissions system-wide

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js (v14+)
- **Framework**: Express.js
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Cloudinary
- **Email**: Nodemailer

### Frontend
- **Core**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with responsive design
- **Notifications**: Toastify.js
- **Carousels**: Swiper.js
- **Typography**: Poppins (Google Fonts)

### Design System
- **Primary Colors**: #FF6B35, #FF8C42, #FFA500
- **Secondary Colors**: #FFFFFF, #F8F9FA
- **Accent Colors**: #E55B2D, #FFB380
- **Typography**: Poppins for all text elements

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/RYTZZ/sorsu-nstp-hub.git
   cd sorsu-nstp-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=sorsu_nstp_hub
   DB_USER=root
   DB_PASSWORD=your_password

   # JWT Secret
   JWT_SECRET=your_secure_jwt_secret

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE sorsu_nstp_hub;
   ```

5. **Seed the database**
   ```bash
   npm run seed
   ```
   
   This creates:
   - 4 campuses (Sorsogon, Bulan, Castilla, Magallanes)
   - Programs for each campus
   - Super Admin account
   - Campus Admin accounts for each campus

6. **Start the server**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

7. **Access the application**
   ```
   http://localhost:3000
   ```

## 👥 Default Accounts

After seeding, use these credentials to login:

### Super Admin
- **Email**: admin@sorsu.edu.ph
- **Password**: admin123

### Campus Admins
- **Sorsogon**: admin.sor@sorsu.edu.ph / admin123
- **Bulan**: admin.bul@sorsu.edu.ph / admin123
- **Castilla**: admin.cas@sorsu.edu.ph / admin123
- **Magallanes**: admin.mag@sorsu.edu.ph / admin123

⚠️ **Important**: Change these default passwords immediately in production!

## 📁 Project Structure

```
sorsu-nstp-hub/
├── backend/
│   ├── config/           # Database and Cloudinary configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Authentication and validation
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── seed.js          # Database seeding script
│   └── server.js        # Main server file
├── public/
│   ├── css/             # Stylesheets
│   ├── js/              # Frontend JavaScript
│   └── images/          # Static images
├── views/               # HTML pages
│   ├── index.html       # Landing page
│   ├── concern.html     # Report concern page
│   ├── gwa-calculator.html
│   ├── track-status.html
│   ├── login.html
│   └── nstp-components.html
├── .env.example         # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Campuses & Programs
- `GET /api/campuses` - Get all campuses
- `GET /api/campuses/:id` - Get campus by ID
- `GET /api/campuses/:campusId/programs` - Get programs by campus

### Concerns
- `POST /api/concerns` - Submit concern
- `GET /api/concerns/reference/:referenceNumber` - Track concern
- `GET /api/concerns` - Get all concerns (Admin only)
- `PUT /api/concerns/:id` - Update concern (Admin only)

### GWA Submissions
- `POST /api/gwa/calculate` - Calculate GWA
- `POST /api/gwa/submit` - Submit GWA
- `GET /api/gwa/reference/:referenceNumber` - Track GWA submission
- `GET /api/gwa` - Get all submissions (Admin only)
- `PUT /api/gwa/:id` - Update submission (Admin only)

### News
- `GET /api/news` - Get published news
- `POST /api/news` - Create news (Admin only)
- `PUT /api/news/:id` - Update news (Admin only)
- `DELETE /api/news/:id` - Delete news (Admin only)

### Settings
- `GET /api/settings` - Get all settings
- `GET /api/settings/check-submissions` - Check if submissions are enabled
- `POST /api/settings/toggle-deadline` - Toggle submissions (Admin only)

## 🚢 Deployment (Render.com)

### Database Setup
1. Create a MySQL database instance on Render
2. Note the connection details

### Web Service Setup
1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**: Add all variables from `.env`

### Environment Variables for Production
```
NODE_ENV=production
PORT=3000
DB_HOST=<render_mysql_host>
DB_PORT=3306
DB_NAME=<database_name>
DB_USER=<database_user>
DB_PASSWORD=<database_password>
JWT_SECRET=<your_secure_secret>
CLOUDINARY_CLOUD_NAME=<your_cloud_name>
CLOUDINARY_API_KEY=<your_api_key>
CLOUDINARY_API_SECRET=<your_api_secret>
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your_email>
EMAIL_PASSWORD=<your_app_password>
```

### Post-Deployment
1. Run database seeding using Render shell:
   ```bash
   npm run seed
   ```
2. Test all functionality
3. Update default admin passwords

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection
- SQL injection prevention (Sequelize ORM)
- XSS protection
- Data privacy compliance

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full feature access with optimal layout
- **Tablet**: Touch-friendly interface with adapted navigation
- **Mobile**: Streamlined UI with mobile-first approach

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style
- Write clear commit messages
- Test all changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the ISC License.

## 📞 Contact & Support

- **Email**: nstp@sorsu.edu.ph
- **Institution**: Sorsogon State University
- **Repository**: https://github.com/RYTZZ/sorsu-nstp-hub

## 🙏 Acknowledgments

- Sorsogon State University
- NSTP Office Staff
- All contributors and users

---

**Built with ❤️ for Sorsogon State University**