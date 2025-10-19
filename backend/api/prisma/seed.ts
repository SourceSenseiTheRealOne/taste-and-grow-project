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

async function main() {
  console.log('🌱 Starting seed...\n');

  // Clear existing data (optional - remove if you want to keep existing data)
  await prisma.schoolActivation.deleteMany({});
  await prisma.experience.deleteMany({});
  await prisma.teacher.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.school.deleteMany({});

  console.log('✨ Creating dummy users and schools...\n');

  // Hash passwords
  const hashedPassword = await bcrypt.hash('Test123!', 10);

  // ========== USER 1: TEACHER with school ==========
  const teacher1 = await prisma.user.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+1234567890',
      password: hashedPassword,
      role: 'TEACHER',
      preferredLanguage: 'en',
    },
  });
  console.log('✅ Created User 1 (TEACHER):');
  console.log(`   Name: ${teacher1.name}`);
  console.log(`   Email: ${teacher1.email}`);
  console.log(`   Role: ${teacher1.role}\n`);

  // Create school for teacher 1
  const school1Code = generateSchoolCode('Central Elementary School');
  const school1 = await prisma.school.create({
    data: {
      schoolName: 'Central Elementary School',
      cityRegion: 'New York, NY',
      contactName: 'Jane Smith',
      email: 'jane@centralelemschool.edu',
      phone: '+1-555-0101',
      studentCount: 450,
      schoolCode: school1Code,
    },
  });

  const accessCode1 = generateSchoolAccessCode(school1.id);
  const parentsLink1 = generateParentsLink(teacher1.id, school1.id);

  const updatedTeacher1 = await prisma.user.update({
    where: { id: teacher1.id },
    data: {
      schoolId: school1.id,
      schoolAccessCode: accessCode1,
      parentsLink: parentsLink1,
    },
  });

  console.log('✅ Created School for Teacher 1:');
  console.log(`   School Name: ${school1.schoolName}`);
  console.log(`   School Code: ${school1.schoolCode}`);
  console.log(`   School Access Code: ${accessCode1}`);
  console.log(`   Parents Link: ${parentsLink1}`);
  console.log(`   Students: ${school1.studentCount}\n`);

  // ========== USER 2: COORDINATOR with school ==========
  const coordinator1 = await prisma.user.create({
    data: {
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      phone: '+1987654321',
      password: hashedPassword,
      role: 'COORDINATOR',
      preferredLanguage: 'en',
    },
  });
  console.log('✅ Created User 2 (COORDINATOR):');
  console.log(`   Name: ${coordinator1.name}`);
  console.log(`   Email: ${coordinator1.email}`);
  console.log(`   Role: ${coordinator1.role}\n`);

  // Create school for coordinator 1
  const school2Code = generateSchoolCode('Downtown High School');
  const school2 = await prisma.school.create({
    data: {
      schoolName: 'Downtown High School',
      cityRegion: 'Los Angeles, CA',
      contactName: 'Robert Johnson',
      email: 'robert@downtownhigh.edu',
      phone: '+1-555-0202',
      studentCount: 1200,
      schoolCode: school2Code,
    },
  });

  const accessCode2 = generateSchoolAccessCode(school2.id);
  const parentsLink2 = generateParentsLink(coordinator1.id, school2.id);

  const updatedCoordinator1 = await prisma.user.update({
    where: { id: coordinator1.id },
    data: {
      schoolId: school2.id,
      schoolAccessCode: accessCode2,
      parentsLink: parentsLink2,
    },
  });

  console.log('✅ Created School for Coordinator:');
  console.log(`   School Name: ${school2.schoolName}`);
  console.log(`   School Code: ${school2.schoolCode}`);
  console.log(`   School Access Code: ${accessCode2}`);
  console.log(`   Parents Link: ${parentsLink2}`);
  console.log(`   Students: ${school2.studentCount}\n`);

  // ========== USER 3: PRINCIPAL with school ==========
  const principal1 = await prisma.user.create({
    data: {
      name: 'Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1555123456',
      password: hashedPassword,
      role: 'PRINCIPAL',
      preferredLanguage: 'pt',
    },
  });
  console.log('✅ Created User 3 (PRINCIPAL):');
  console.log(`   Name: ${principal1.name}`);
  console.log(`   Email: ${principal1.email}`);
  console.log(`   Role: ${principal1.role}`);
  console.log(`   Language: ${principal1.preferredLanguage}\n`);

  // Create school for principal 1
  const school3Code = generateSchoolCode('Riverside Middle School');
  const school3 = await prisma.school.create({
    data: {
      schoolName: 'Riverside Middle School',
      cityRegion: 'Chicago, IL',
      contactName: 'Maria Garcia',
      email: 'maria@riversidems.edu',
      phone: '+1-555-0303',
      studentCount: 800,
      schoolCode: school3Code,
    },
  });

  const accessCode3 = generateSchoolAccessCode(school3.id);
  const parentsLink3 = generateParentsLink(principal1.id, school3.id);

  const updatedPrincipal1 = await prisma.user.update({
    where: { id: principal1.id },
    data: {
      schoolId: school3.id,
      schoolAccessCode: accessCode3,
      parentsLink: parentsLink3,
    },
  });

  console.log('✅ Created School for Principal:');
  console.log(`   School Name: ${school3.schoolName}`);
  console.log(`   School Code: ${school3.schoolCode}`);
  console.log(`   School Access Code: ${accessCode3}`);
  console.log(`   Parents Link: ${parentsLink3}`);
  console.log(`   Students: ${school3.studentCount}\n`);

  // ========== USER 4: ADMIN (no school) ==========
  const admin1 = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@tasteandgrow.com',
      phone: '+1555999888',
      password: hashedPassword,
      role: 'ADMIN',
      preferredLanguage: 'en',
    },
  });
  console.log('✅ Created User 4 (ADMIN):');
  console.log(`   Name: ${admin1.name}`);
  console.log(`   Email: ${admin1.email}`);
  console.log(`   Role: ${admin1.role}`);
  console.log(`   Note: Admin user has no school\n`);

  // ========== USER 5: REGULAR USER (no special role, no school) ==========
  const regularUser = await prisma.user.create({
    data: {
      name: 'Regular User',
      email: 'regular.user@example.com',
      phone: '+1555888777',
      password: hashedPassword,
      role: 'USER',
      preferredLanguage: 'en',
    },
  });
  console.log('✅ Created User 5 (USER):');
  console.log(`   Name: ${regularUser.name}`);
  console.log(`   Email: ${regularUser.email}`);
  console.log(`   Role: ${regularUser.role}`);
  console.log(`   Note: Regular user with no school\n`);

  // ========== SUMMARY ==========
  console.log('\n' + '='.repeat(60));
  console.log('📊 SEED COMPLETED SUCCESSFULLY!');
  console.log('='.repeat(60) + '\n');

  console.log('🔐 LOGIN CREDENTIALS (for all users):');
  console.log('   Password: Test123!\n');

  console.log('👥 USERS CREATED:\n');
  
  console.log('1️⃣  TEACHER');
  console.log(`   Email: ${teacher1.email}`);
  console.log(`   School: ${school1.schoolName}`);
  console.log(`   Access Code: ${accessCode1}`);
  console.log(`   Parents Link: ${parentsLink1}\n`);

  console.log('2️⃣  COORDINATOR');
  console.log(`   Email: ${coordinator1.email}`);
  console.log(`   School: ${school2.schoolName}`);
  console.log(`   Access Code: ${accessCode2}`);
  console.log(`   Parents Link: ${parentsLink2}\n`);

  console.log('3️⃣  PRINCIPAL');
  console.log(`   Email: ${principal1.email}`);
  console.log(`   School: ${school3.schoolName}`);
  console.log(`   Access Code: ${accessCode3}`);
  console.log(`   Parents Link: ${parentsLink3}\n`);

  console.log('4️⃣  ADMIN');
  console.log(`   Email: ${admin1.email}`);
  console.log(`   Role: ${admin1.role} (can manage all schools and users)\n`);

  console.log('5️⃣  REGULAR USER');
  console.log(`   Email: ${regularUser.email}`);
  console.log(`   Role: ${regularUser.role} (no special privileges)\n`);

  console.log('🏫 SCHOOLS CREATED:\n');
  console.log(`1. ${school1.schoolName}`);
  console.log(`   Owner: ${teacher1.name}`);
  console.log(`   Code: ${school1.schoolCode}\n`);

  console.log(`2. ${school2.schoolName}`);
  console.log(`   Owner: ${coordinator1.name}`);
  console.log(`   Code: ${school2.schoolCode}\n`);

  console.log(`3. ${school3.schoolName}`);
  console.log(`   Owner: ${principal1.name}`);
  console.log(`   Code: ${school3.schoolCode}\n`);

  console.log('💡 NEXT STEPS:');
  console.log('   1. Check Supabase dashboard to see the data');
  console.log('   2. Try logging in with different user emails');
  console.log('   3. Test the API endpoints with these accounts\n');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

