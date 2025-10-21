import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Code generation utilities
function generateSchoolAccessCode(schoolId: string): string {
  const codeBase = schoolId.substring(0, 12).toUpperCase();
  const part1 = codeBase.substring(0, 4);
  const part2 = codeBase.substring(4, 8);
  const part3 = codeBase.substring(8, 12);
  return `${part1}-${part2}-${part3}`;
}

function generateSchoolCode(schoolName: string): string {
  const words = schoolName.split(' ').slice(0, 3);
  return words.map(w => w.substring(0, 4).toUpperCase()).join('-');
}

function generateParentsLink(userId: string, schoolId: string): string {
  const combinedId = `${userId}-${schoolId}`.substring(0, 16);
  const encoded = Buffer.from(combinedId).toString('base64').replace(/[=+/]/g, '');
  return `/parent-link/${encoded}`;
}

function generateQRCode(): string {
  return `QR-${Math.random().toString(36).substring(2, 15).toUpperCase()}`;
}

async function main() {
  console.log('🌱 Starting comprehensive seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.schoolActivation.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.websiteContent.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.school.deleteMany({});
  console.log('✅ Existing data cleared\n');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('Test123!', 10);

  console.log('👥 Creating users with different roles...\n');

  // ========== USER 1: ADMIN (Dashboard Access) ==========
  const admin1 = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@tasteandgrow.com',
      phone: '+1-555-999-0001',
      password: hashedPassword,
      role: 'ADMIN',
      preferredLanguage: 'en',
    },
  });
  console.log('✅ Created ADMIN User:');
  console.log(`   Email: ${admin1.email}`);
  console.log(`   Password: Test123!`);
  console.log(`   Role: ${admin1.role} (Full dashboard access)\n`);

  // ========== USER 2: TEACHER with School ==========
  const teacher1 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@school.com',
      phone: '+1-555-100-0001',
      password: hashedPassword,
      role: 'TEACHER',
      preferredLanguage: 'en',
    },
  });

  // ========== USER 3: COORDINATOR with School ==========
  const coordinator1 = await prisma.user.create({
    data: {
      name: 'Robert Johnson',
      email: 'robert.johnson@school.com',
      phone: '+1-555-100-0002',
      password: hashedPassword,
      role: 'COORDINATOR',
      preferredLanguage: 'en',
    },
  });

  // ========== USER 4: PRINCIPAL with School ==========
  const principal1 = await prisma.user.create({
    data: {
      name: 'Maria Garcia',
      email: 'maria.garcia@school.com',
      phone: '+1-555-100-0003',
      password: hashedPassword,
      role: 'PRINCIPAL',
      preferredLanguage: 'es',
    },
  });

  // ========== USER 5-7: More Teachers ==========
  const teacher2 = await prisma.user.create({
    data: {
      name: 'Michael Brown',
      email: 'michael.brown@school.com',
      phone: '+1-555-100-0004',
      password: hashedPassword,
      role: 'TEACHER',
      preferredLanguage: 'en',
    },
  });

  const teacher3 = await prisma.user.create({
    data: {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@school.com',
      phone: '+1-555-100-0005',
      password: hashedPassword,
      role: 'TEACHER',
      preferredLanguage: 'fr',
    },
  });

  // ========== USER 8-10: Regular Users ==========
  const user1 = await prisma.user.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+1-555-200-0001',
      password: hashedPassword,
      role: 'USER',
      preferredLanguage: 'en',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Emily Davis',
      email: 'emily.davis@email.com',
      phone: '+1-555-200-0002',
      password: hashedPassword,
      role: 'USER',
      preferredLanguage: 'en',
    },
  });

  console.log('✅ Created 8 users with various roles\n');

  console.log('🏫 Creating schools...\n');

  // ========== SCHOOL 1 ==========
  const school1Code = generateSchoolCode('Central Elementary School');
  const school1 = await prisma.school.create({
    data: {
      schoolName: 'Central Elementary School',
      cityRegion: 'New York, NY',
      contactName: 'Jane Smith',
      email: 'contact@centralelem.edu',
      phone: '+1-555-301-0001',
      studentCount: 450,
      schoolCode: school1Code,
    },
  });

  // Link teacher1 to school1
  const accessCode1 = generateSchoolAccessCode(school1.id);
  const parentsLink1 = generateParentsLink(teacher1.id, school1.id);
  await prisma.user.update({
    where: { id: teacher1.id },
    data: {
      schoolId: school1.id,
      schoolAccessCode: accessCode1,
      parentsLink: parentsLink1,
    },
  });

  console.log(`✅ Created School 1: ${school1.schoolName}`);
  console.log(`   Code: ${school1.schoolCode}`);
  console.log(`   Access Code: ${accessCode1}`);
  console.log(`   Students: ${school1.studentCount}\n`);

  // ========== SCHOOL 2 ==========
  const school2Code = generateSchoolCode('Downtown High School');
  const school2 = await prisma.school.create({
    data: {
      schoolName: 'Downtown High School',
      cityRegion: 'Los Angeles, CA',
      contactName: 'Robert Johnson',
      email: 'contact@downtownhigh.edu',
      phone: '+1-555-301-0002',
      studentCount: 1200,
      schoolCode: school2Code,
    },
  });

  const accessCode2 = generateSchoolAccessCode(school2.id);
  const parentsLink2 = generateParentsLink(coordinator1.id, school2.id);
  await prisma.user.update({
    where: { id: coordinator1.id },
    data: {
      schoolId: school2.id,
      schoolAccessCode: accessCode2,
      parentsLink: parentsLink2,
    },
  });

  console.log(`✅ Created School 2: ${school2.schoolName}`);
  console.log(`   Code: ${school2.schoolCode}`);
  console.log(`   Access Code: ${accessCode2}`);
  console.log(`   Students: ${school2.studentCount}\n`);

  // ========== SCHOOL 3 ==========
  const school3Code = generateSchoolCode('Riverside Middle School');
  const school3 = await prisma.school.create({
    data: {
      schoolName: 'Riverside Middle School',
      cityRegion: 'Chicago, IL',
      contactName: 'Maria Garcia',
      email: 'contact@riversidems.edu',
      phone: '+1-555-301-0003',
      studentCount: 800,
      schoolCode: school3Code,
    },
  });

  const accessCode3 = generateSchoolAccessCode(school3.id);
  const parentsLink3 = generateParentsLink(principal1.id, school3.id);
  await prisma.user.update({
    where: { id: principal1.id },
    data: {
      schoolId: school3.id,
      schoolAccessCode: accessCode3,
      parentsLink: parentsLink3,
    },
  });

  console.log(`✅ Created School 3: ${school3.schoolName}`);
  console.log(`   Code: ${school3.schoolCode}`);
  console.log(`   Access Code: ${accessCode3}`);
  console.log(`   Students: ${school3.studentCount}\n`);

  // ========== SCHOOL 4 & 5 (without users yet) ==========
  const school4 = await prisma.school.create({
    data: {
      schoolName: 'Sunset Valley Academy',
      cityRegion: 'Austin, TX',
      contactName: 'Michael Brown',
      email: 'contact@sunsetvalley.edu',
      phone: '+1-555-301-0004',
      studentCount: 600,
      schoolCode: generateSchoolCode('Sunset Valley Academy'),
    },
  });

  const school5 = await prisma.school.create({
    data: {
      schoolName: 'Oakwood Preparatory',
      cityRegion: 'Boston, MA',
      contactName: 'Sarah Wilson',
      email: 'contact@oakwoodprep.edu',
      phone: '+1-555-301-0005',
      studentCount: 350,
      schoolCode: generateSchoolCode('Oakwood Preparatory'),
    },
  });

  console.log(`✅ Created Schools 4 & 5\n`);

  console.log('👨‍🏫 Creating teachers...\n');

  // ========== TEACHERS ==========
  const teacher_db1 = await prisma.teacher.create({
    data: {
      name: 'Alice Cooper',
      email: 'alice.cooper@centralelem.edu',
      password: hashedPassword,
      schoolId: school1.id,
    },
  });

  const teacher_db2 = await prisma.teacher.create({
    data: {
      name: 'Bob Williams',
      email: 'bob.williams@centralelem.edu',
      password: hashedPassword,
      schoolId: school1.id,
    },
  });

  const teacher_db3 = await prisma.teacher.create({
    data: {
      name: 'Carlos Rodriguez',
      email: 'carlos.rodriguez@downtownhigh.edu',
      password: hashedPassword,
      schoolId: school2.id,
    },
  });

  const teacher_db4 = await prisma.teacher.create({
    data: {
      name: 'Diana Prince',
      email: 'diana.prince@riversidems.edu',
      password: hashedPassword,
      schoolId: school3.id,
    },
  });

  console.log(`✅ Created 4 teachers across schools\n`);

  console.log('🎁 Creating food kit experiences...\n');

  // ========== EXPERIENCES ==========
  const exp1 = await prisma.experience.create({
    data: {
      schoolId: school1.id,
      name: 'Heritage Flours Experience',
      description: 'Ancient grains that tell the story of our ancestors',
      basePrice: 25.0,
      itemsIncluded: ['500g Barbela Flour', '500g Preto Amarelo Flour', 'Recipe Book', 'Information Card'],
      active: true,
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      schoolId: school1.id,
      name: 'Rare Olive Oil Experience',
      description: 'Premium olive oil from protected groves',
      basePrice: 35.0,
      itemsIncluded: ['500ml Premium Olive Oil', 'Tasting Guide', 'Recipe Ideas', 'Farm Story Card'],
      active: true,
    },
  });

  const exp3 = await prisma.experience.create({
    data: {
      schoolId: school2.id,
      name: 'Heritage Flours Experience',
      description: 'Ancient grains experience for our school',
      basePrice: 27.0,
      itemsIncluded: ['500g Barbela Flour', '500g Preto Amarelo Flour', 'Recipe Book'],
      active: true,
    },
  });

  const exp4 = await prisma.experience.create({
    data: {
      schoolId: school3.id,
      name: 'Rare Olive Oil Experience',
      description: 'Premium olive oil tasting experience',
      basePrice: 32.0,
      itemsIncluded: ['500ml Premium Olive Oil', 'Tasting Guide', 'Recipe Ideas'],
      active: true,
    },
  });

  console.log(`✅ Created 4 food kit experiences\n`);

  console.log('📅 Creating school activations...\n');

  // ========== SCHOOL ACTIVATIONS ==========
  const activation1 = await prisma.schoolActivation.create({
    data: {
      schoolId: school1.id,
      experienceId: exp1.id,
      eventDate: new Date('2025-11-15'),
      fundraiserAmount: 5.0,
      totalRaised: 450.0,
      parentQrCode: generateQRCode(),
      teacherQrCode: generateQRCode(),
      status: 'active',
    },
  });

  const activation2 = await prisma.schoolActivation.create({
    data: {
      schoolId: school1.id,
      experienceId: exp2.id,
      eventDate: new Date('2025-12-01'),
      fundraiserAmount: 7.0,
      totalRaised: 0,
      parentQrCode: generateQRCode(),
      teacherQrCode: generateQRCode(),
      status: 'pending',
    },
  });

  const activation3 = await prisma.schoolActivation.create({
    data: {
      schoolId: school2.id,
      experienceId: exp3.id,
      eventDate: new Date('2025-11-20'),
      fundraiserAmount: 6.0,
      totalRaised: 810.0,
      parentQrCode: generateQRCode(),
      teacherQrCode: generateQRCode(),
      status: 'delivered',
    },
  });

  const activation4 = await prisma.schoolActivation.create({
    data: {
      schoolId: school3.id,
      experienceId: exp4.id,
      eventDate: new Date('2025-12-10'),
      fundraiserAmount: 5.5,
      totalRaised: 0,
      parentQrCode: generateQRCode(),
      teacherQrCode: generateQRCode(),
      status: 'pending',
    },
  });

  console.log(`✅ Created 4 school activations\n`);

  console.log('🌐 Creating website content...\n');

  // ========== WEBSITE CONTENT ==========
  const websiteContent = [
    // Hero Section
    { section: 'HERO', key: 'title', value: 'Play. Learn. Taste. Grow.', order: 1 },
    { section: 'HERO', key: 'subtitle', value: 'Taste & Grow helps schools turn real food into learning and fundraising — with students leading their own school e-market and families ordering online.', order: 2 },
    { section: 'HERO', key: 'tagline', value: 'Built for schools. Inspired by nature.', order: 3 },

    // How It Works
    { section: 'HOW_IT_WORKS', key: 'title', value: 'How It Works', order: 1 },
    { section: 'HOW_IT_WORKS', key: 'step_1_title', value: 'Teacher Registers', order: 2 },
    { section: 'HOW_IT_WORKS', key: 'step_1_desc', value: 'Have your class take the lead. Choose one of the three food kits and pick your preferred date.', order: 3 },
    { section: 'HOW_IT_WORKS', key: 'step_2_title', value: 'Parents Buy Online', order: 4 },
    { section: 'HOW_IT_WORKS', key: 'step_2_desc', value: 'Families order easily through a QR code. We deliver everything directly to the school, ready for the big day.', order: 5 },
    { section: 'HOW_IT_WORKS', key: 'step_3_title', value: 'Students Lead the Market', order: 6 },
    { section: 'HOW_IT_WORKS', key: 'step_3_desc', value: 'Students pack, present, and share what they\'ve learned — turning their classroom into a mini market stand.', order: 7 },
    { section: 'HOW_IT_WORKS', key: 'step_4_title', value: 'School Grows', order: 8 },
    { section: 'HOW_IT_WORKS', key: 'step_4_desc', value: 'Each order raises funds and builds community through real, hands-on learning.', order: 9 },

    // Food Kits
    { section: 'FOOD_KIT', key: 'section_title', value: 'Real Superfoods. Real Learning. Real Impact.', order: 1 },
    { section: 'FOOD_KIT', key: 'section_subtitle', value: 'Each Superfood Kit connects classrooms to powerful foods, inspiring students to explore their origins, taste their benefits, and share their story. It\'s time to Play, Learn, Taste, and Grow!', order: 2 },

    // Footer
    { section: 'FOOTER', key: 'company_name', value: 'Taste & Grow', order: 1 },
    { section: 'FOOTER', key: 'tagline', value: 'Built for schools. Inspired by nature.', order: 2 },
    { section: 'FOOTER', key: 'email', value: 'hello@tasteandgrow.com', order: 3 },
    { section: 'FOOTER', key: 'copyright', value: '© 2025 Taste & Grow. All rights reserved.', order: 4 },
  ];

  for (const content of websiteContent) {
    await prisma.websiteContent.create({
      data: content as any,
    });
  }

  console.log(`✅ Created ${websiteContent.length} website content items\n`);

  // ========== SUMMARY ==========
  console.log('\n' + '='.repeat(70));
  console.log('🎉 COMPREHENSIVE SEED COMPLETED SUCCESSFULLY!');
  console.log('='.repeat(70) + '\n');

  console.log('🔐 LOGIN CREDENTIALS (All Users):');
  console.log('   Password: Test123!\n');

  console.log('👥 USERS CREATED:\n');
  console.log('1️⃣  ADMIN (Dashboard Access)');
  console.log(`   Email: ${admin1.email}`);
  console.log(`   Role: ADMIN - Can manage everything\n`);

  console.log('2️⃣  TEACHER (with School 1)');
  console.log(`   Email: ${teacher1.email}`);
  console.log(`   School: ${school1.schoolName}`);
  console.log(`   Access Code: ${accessCode1}\n`);

  console.log('3️⃣  COORDINATOR (with School 2)');
  console.log(`   Email: ${coordinator1.email}`);
  console.log(`   School: ${school2.schoolName}`);
  console.log(`   Access Code: ${accessCode2}\n`);

  console.log('4️⃣  PRINCIPAL (with School 3)');
  console.log(`   Email: ${principal1.email}`);
  console.log(`   School: ${school3.schoolName}`);
  console.log(`   Access Code: ${accessCode3}\n`);

  console.log('5️⃣  Additional Teachers (2 more)');
  console.log(`   Emails: ${teacher2.email}, ${teacher3.email}\n`);

  console.log('6️⃣  Regular Users (2)');
  console.log(`   Emails: ${user1.email}, ${user2.email}\n`);

  console.log('🏫 SCHOOLS CREATED: 5 schools\n');
  console.log(`   1. ${school1.schoolName} (${school1.studentCount} students)`);
  console.log(`   2. ${school2.schoolName} (${school2.studentCount} students)`);
  console.log(`   3. ${school3.schoolName} (${school3.studentCount} students)`);
  console.log(`   4. ${school4.schoolName} (${school4.studentCount} students)`);
  console.log(`   5. ${school5.schoolName} (${school5.studentCount} students)\n`);

  console.log('👨‍🏫 TEACHERS (Database): 4 teachers\n');

  console.log('🎁 EXPERIENCES: 4 food kit experiences');
  console.log(`   - Heritage Flours (2 schools)`);
  console.log(`   - Rare Olive Oil (2 schools)\n`);

  console.log('📅 SCHOOL ACTIVATIONS: 4 activations');
  console.log(`   - Active: 1`);
  console.log(`   - Pending: 2`);
  console.log(`   - Delivered: 1\n`);

  console.log('🌐 WEBSITE CONTENT: 18 content items');
  console.log(`   - Hero Section: 3 items`);
  console.log(`   - How It Works: 9 items`);
  console.log(`   - Food Kits: 2 items`);
  console.log(`   - Footer: 4 items\n`);

  console.log('💡 QUICK START:\n');
  console.log('   Dashboard Login:');
  console.log(`   → Email: ${admin1.email}`);
  console.log(`   → Password: Test123!\n`);

  console.log('   Website Login (any role):');
  console.log(`   → Teacher: ${teacher1.email}`);
  console.log(`   → Coordinator: ${coordinator1.email}`);
  console.log(`   → Principal: ${principal1.email}`);
  console.log(`   → Password: Test123! (for all)\n`);

  console.log('🎯 READY TO:');
  console.log('   ✅ Test admin dashboard');
  console.log('   ✅ Edit website content from dashboard');
  console.log('   ✅ Manage users and schools');
  console.log('   ✅ View experiences and activations');
  console.log('   ✅ Test all user roles\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
