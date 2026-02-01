# Deployment Checklist for SorSU NSTP Hub

## Pre-Deployment Setup

### 1. Render.com Account Setup
- [ ] Create Render.com account
- [ ] Connect GitHub repository to Render
- [ ] Verify repository access

### 2. Database Setup
- [ ] Create MySQL database instance on Render
- [ ] Note down the following credentials:
  - [ ] DB_HOST
  - [ ] DB_PORT
  - [ ] DB_NAME
  - [ ] DB_USER
  - [ ] DB_PASSWORD
- [ ] Test database connection

### 3. Cloudinary Setup
- [ ] Create Cloudinary account (https://cloudinary.com)
- [ ] Get the following from dashboard:
  - [ ] CLOUDINARY_CLOUD_NAME
  - [ ] CLOUDINARY_API_KEY
  - [ ] CLOUDINARY_API_SECRET
- [ ] Test upload functionality

### 4. Email Service Setup
- [ ] Setup Gmail account for notifications
- [ ] Enable 2-factor authentication
- [ ] Generate app-specific password
- [ ] Note down:
  - [ ] EMAIL_USER (Gmail address)
  - [ ] EMAIL_PASSWORD (App password)

## Render Deployment

### 1. Create Web Service
- [ ] Go to Render Dashboard
- [ ] Click "New +" → "Web Service"
- [ ] Connect GitHub repository: RYTZZ/sorsu-nstp-hub
- [ ] Configure service:
  - **Name**: sorsu-nstp-hub
  - **Region**: Choose closest to your location
  - **Branch**: main (or your deployment branch)
  - **Root Directory**: Leave blank
  - **Runtime**: Node
  - **Build Command**: `npm install`
  - **Start Command**: `npm start`
  - **Plan**: Free or paid (based on requirements)

### 2. Environment Variables Setup
Add all environment variables in Render dashboard:

```
NODE_ENV=production
PORT=3000

# Database (from your Render MySQL instance)
DB_HOST=<your-render-mysql-host>
DB_PORT=3306
DB_NAME=sorsu_nstp_hub
DB_USER=<your-db-user>
DB_PASSWORD=<your-db-password>

# JWT Secret (generate a strong random string)
JWT_SECRET=<generate-strong-random-string>

# Cloudinary
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=<your-gmail-address>
EMAIL_PASSWORD=<your-gmail-app-password>
EMAIL_FROM=noreply@sorsu-nstp.edu.ph

# Frontend URL (will be your Render URL)
FRONTEND_URL=https://<your-app-name>.onrender.com
```

### 3. Deploy Application
- [ ] Click "Create Web Service"
- [ ] Wait for deployment to complete (5-10 minutes)
- [ ] Check deployment logs for errors
- [ ] Note your application URL: `https://<your-app-name>.onrender.com`

### 4. Initialize Database
After successful deployment:
- [ ] Go to Render Dashboard → Your Service → Shell
- [ ] Run: `npm run seed`
- [ ] Wait for seeding to complete
- [ ] Verify success message with default credentials

## Post-Deployment Verification

### 1. Basic Functionality Tests
- [ ] Access homepage: `https://<your-app-name>.onrender.com`
- [ ] Test all navigation links
- [ ] Verify campus selection works
- [ ] Check responsive design on mobile/tablet

### 2. Public Features
- [ ] Test Report Concern:
  - [ ] Select campus
  - [ ] Fill form
  - [ ] Submit (test with real email)
  - [ ] Verify reference number generated
  - [ ] Check email notification received
  
- [ ] Test GWA Calculator:
  - [ ] Calculate GWA < 2.00 (qualified)
  - [ ] Calculate GWA > 2.00 (disqualified)
  - [ ] Verify popup display
  - [ ] Submit for evaluation
  - [ ] Check reference number

- [ ] Test Status Tracking:
  - [ ] Track concern by reference number
  - [ ] Track GWA by reference number
  - [ ] Verify details displayed correctly

- [ ] Test NSTP Components page:
  - [ ] Verify all dropdowns work
  - [ ] Check content accuracy

- [ ] Test News page:
  - [ ] Load news feed
  - [ ] Test campus filter
  - [ ] Verify carousel works (if news available)

### 3. Admin Features
- [ ] Login as Super Admin:
  - Email: admin@sorsu.edu.ph
  - Password: admin123
  
- [ ] Verify Dashboard:
  - [ ] Statistics display correctly
  - [ ] Recent items load
  - [ ] All sidebar links work

- [ ] Test each Campus Admin:
  - [ ] admin.sor@sorsu.edu.ph
  - [ ] admin.bul@sorsu.edu.ph
  - [ ] admin.cas@sorsu.edu.ph
  - [ ] admin.mag@sorsu.edu.ph

- [ ] Test Concern Management:
  - [ ] View concerns
  - [ ] Update status
  - [ ] Add admin notes

- [ ] Test GWA Management:
  - [ ] View submissions
  - [ ] Verify/reject submissions
  - [ ] Add admin notes

### 4. Security Verification
- [ ] Change all default passwords immediately
- [ ] Test JWT expiration
- [ ] Verify role-based access works
- [ ] Test unauthorized access (should be blocked)
- [ ] Check CORS configuration

## Production Configuration

### 1. Security Hardening
- [ ] Change default admin passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS (Render provides this automatically)
- [ ] Review CORS settings
- [ ] Set up rate limiting (if needed)

### 2. Email Configuration
- [ ] Test email notifications work
- [ ] Verify sender name displays correctly
- [ ] Check spam folder if emails not received
- [ ] Update email templates if needed

### 3. File Upload
- [ ] Test concern attachment upload
- [ ] Test GWA proof upload
- [ ] Test news image upload
- [ ] Verify Cloudinary storage

### 4. Database Optimization
- [ ] Review indexes
- [ ] Set up automated backups
- [ ] Monitor database size
- [ ] Plan for scaling if needed

## Monitoring & Maintenance

### Daily
- [ ] Check application is accessible
- [ ] Monitor error logs
- [ ] Review new submissions

### Weekly
- [ ] Backup database
- [ ] Review user reports
- [ ] Check email delivery
- [ ] Monitor Cloudinary usage

### Monthly
- [ ] Review security logs
- [ ] Update dependencies if needed
- [ ] Performance optimization
- [ ] User feedback review

## Troubleshooting

### Common Issues

**Database Connection Failed**
- Verify DB credentials in environment variables
- Check database is running
- Verify IP whitelist (Render manages this automatically)

**Email Not Sending**
- Check Gmail app password
- Verify 2FA is enabled
- Check EMAIL_USER and EMAIL_PASSWORD
- Review email service logs

**File Upload Fails**
- Verify Cloudinary credentials
- Check API key permissions
- Review Cloudinary usage limits
- Check file size restrictions

**Application Crashes**
- Check Render logs
- Verify all environment variables set
- Check for missing dependencies
- Review error messages

### Getting Help
- Render Documentation: https://render.com/docs
- Cloudinary Docs: https://cloudinary.com/documentation
- Project Issues: https://github.com/RYTZZ/sorsu-nstp-hub/issues

## Success Criteria
✅ Application is accessible via public URL
✅ All pages load without errors
✅ Database operations work correctly
✅ Email notifications sent successfully
✅ File uploads work properly
✅ Admin features accessible with authentication
✅ Responsive design works on all devices
✅ Security measures in place

---

**Deployment Date**: _____________

**Deployed By**: _____________

**Application URL**: _____________

**Notes**: _____________________________________________
