require('dotenv').config();
const sequelize = require('./config/database');
const { Campus, Program, User, Setting } = require('./models');

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');

    // Create campuses
    const campuses = await Campus.bulkCreate([
      { name: 'Sorsogon City Campus', code: 'SOR', location: 'Sorsogon City' },
      { name: 'Bulan Campus', code: 'BUL', location: 'Bulan, Sorsogon' },
      { name: 'Castilla Campus', code: 'CAS', location: 'Castilla, Sorsogon' },
      { name: 'Magallanes Campus', code: 'MAG', location: 'Magallanes, Sorsogon' }
    ]);

    console.log('Campuses created:', campuses.length);

    // Create programs for each campus
    const programs = [];
    const programsList = [
      { name: 'Bachelor of Science in Information Technology', code: 'BSIT' },
      { name: 'Bachelor of Science in Computer Science', code: 'BSCS' },
      { name: 'Bachelor of Science in Education', code: 'BSED' },
      { name: 'Bachelor of Elementary Education', code: 'BEED' },
      { name: 'Bachelor of Science in Business Administration', code: 'BSBA' },
      { name: 'Bachelor of Science in Accountancy', code: 'BSA' },
      { name: 'Bachelor of Science in Engineering', code: 'BSE' },
      { name: 'Bachelor of Science in Agriculture', code: 'BSAG' }
    ];

    for (const campus of campuses) {
      for (const prog of programsList) {
        programs.push({
          name: prog.name,
          code: prog.code,
          campusId: campus.id
        });
      }
    }

    await Program.bulkCreate(programs);
    console.log('Programs created:', programs.length);

    // Create super admin user
    const superAdmin = await User.create({
      email: 'admin@sorsu.edu.ph',
      password: 'admin123',
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      campusId: campuses[0].id
    });

    console.log('Super Admin created:', superAdmin.email);

    // Create campus admins
    for (let i = 0; i < campuses.length; i++) {
      const campus = campuses[i];
      await User.create({
        email: `admin.${campus.code.toLowerCase()}@sorsu.edu.ph`,
        password: 'admin123',
        firstName: `${campus.name}`,
        lastName: 'Admin',
        role: 'campus_admin',
        campusId: campus.id
      });
    }

    console.log('Campus Admins created for all campuses');

    // Create default settings
    await Setting.bulkCreate([
      {
        key: 'submissions_enabled',
        value: 'true',
        description: 'Enable or disable site-wide submissions'
      },
      {
        key: 'site_name',
        value: 'SorSU NSTP Service Hub',
        description: 'Website name'
      },
      {
        key: 'contact_email',
        value: 'nstp@sorsu.edu.ph',
        description: 'Contact email for inquiries'
      }
    ]);

    console.log('Settings created');
    console.log('Database seeding completed successfully!');
    
    console.log('\n=== Login Credentials ===');
    console.log('Super Admin:');
    console.log('  Email: admin@sorsu.edu.ph');
    console.log('  Password: admin123');
    console.log('\nCampus Admins:');
    campuses.forEach(campus => {
      console.log(`  ${campus.name}:`);
      console.log(`    Email: admin.${campus.code.toLowerCase()}@sorsu.edu.ph`);
      console.log(`    Password: admin123`);
    });
    console.log('========================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

// Run seeding
sequelize.sync({ force: true })
  .then(() => {
    console.log('Database tables created');
    return seedDatabase();
  })
  .catch(error => {
    console.error('Database sync error:', error);
    process.exit(1);
  });
