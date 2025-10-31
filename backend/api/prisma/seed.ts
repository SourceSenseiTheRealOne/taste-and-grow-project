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
    // Hero Section (New Website)
    { section: 'HERO', key: 'animated', value: JSON.stringify(['Play.', 'Learn.', 'Taste.', 'Grow.']), order: 1 },
    { section: 'HERO', key: 'description', value: 'Taste & Grow is a playful science platform where classrooms explore forgotten foods, rediscover lost flavors, and protect the world\'s disappearing biodiversity — one seed at a time.', order: 2 },
    { section: 'HERO', key: 'cta', value: 'Register Your Class', order: 3 },

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

    // Cinematic Intro Section (New Website)
    { section: 'CINEMATIC_INTRO', key: 'title', value: 'The World Is Losing Its Taste', order: 1 },
    { section: 'CINEMATIC_INTRO', key: 'description', value: 'In the past 100 years, nearly 75% of the world\'s edible plant varieties have disappeared.', order: 2 },
    { section: 'CINEMATIC_INTRO', key: 'description2', value: 'Every time a traditional fruit or grain vanishes, we lose flavor, nutrition, and knowledge — parts of our story we can never taste again.', order: 3 },
    { section: 'CINEMATIC_INTRO', key: 'stat1', value: 'Food varieties lost in the last 100 years', order: 4 },
    { section: 'CINEMATIC_INTRO', key: 'stat2', value: 'Still Possible to Protect', order: 5 },
    { section: 'CINEMATIC_INTRO', key: 'stat3', value: 'Foods That Can Be Saved Worldwide', order: 6 },

    // Mission Roles Section (New Website)
    { section: 'MISSION_ROLES', key: 'title', value: 'Select Your Role', order: 1 },
    { section: 'MISSION_ROLES', key: 'subtitle', value: 'Every child becomes a hero in the Taste & Grow world. Each role helps protect our planet\'s forgotten foods and brings biodiversity back to life. Your mission begins here.', order: 2 },
    { section: 'MISSION_ROLES', key: 'footerNote', value: 'More missions unlock as the World Seed Bank grows.', order: 3 },
    { section: 'MISSION_ROLES', key: 'startMission', value: 'Start Your Mission', order: 4 },
    { section: 'MISSION_ROLES', key: 'comingSoon', value: 'Coming Soon', order: 5 },
    // Mission Roles - Seed Guardian
    { section: 'MISSION_ROLES', key: 'role_seedGuardian_name', value: 'Seed Guardian', order: 6 },
    { section: 'MISSION_ROLES', key: 'role_seedGuardian_title', value: 'Kids', order: 7 },
    { section: 'MISSION_ROLES', key: 'role_seedGuardian_mission', value: 'Collect, taste, and protect lost seeds.', order: 8 },
    // Mission Roles - Knowledge Keeper
    { section: 'MISSION_ROLES', key: 'role_knowledgeKeeper_name', value: 'Knowledge Keeper', order: 9 },
    { section: 'MISSION_ROLES', key: 'role_knowledgeKeeper_title', value: 'Teacher', order: 10 },
    { section: 'MISSION_ROLES', key: 'role_knowledgeKeeper_mission', value: 'Guide young minds to become Seed Guardians.', order: 11 },
    // Mission Roles - Earth Builder
    { section: 'MISSION_ROLES', key: 'role_earthBuilder_name', value: 'Earth Builder', order: 12 },
    { section: 'MISSION_ROLES', key: 'role_earthBuilder_title', value: 'Grower', order: 13 },
    { section: 'MISSION_ROLES', key: 'role_earthBuilder_mission', value: 'Cultivate heritage crops and restore biodiversity.', order: 14 },
    // Mission Roles - Home Nurturer
    { section: 'MISSION_ROLES', key: 'role_homeNurturer_name', value: 'Home Nurturer', order: 15 },
    { section: 'MISSION_ROLES', key: 'role_homeNurturer_title', value: 'Parent', order: 16 },
    { section: 'MISSION_ROLES', key: 'role_homeNurturer_mission', value: 'Grow food stories and healthy habits at home.', order: 17 },
    // Mission Roles - Seed Keeper
    { section: 'MISSION_ROLES', key: 'role_seedKeeper_name', value: 'Seed Keeper', order: 18 },
    { section: 'MISSION_ROLES', key: 'role_seedKeeper_title', value: 'Researcher', order: 19 },
    { section: 'MISSION_ROLES', key: 'role_seedKeeper_mission', value: 'Study, document, and preserve genetic diversity.', order: 20 },
    // Mission Roles - Pollinator
    { section: 'MISSION_ROLES', key: 'role_pollinator_name', value: 'Pollinator', order: 21 },
    { section: 'MISSION_ROLES', key: 'role_pollinator_title', value: 'Volunteer / Donor', order: 22 },
    { section: 'MISSION_ROLES', key: 'role_pollinator_mission', value: 'Support the mission through donations or community action.', order: 23 },
    // Mission Roles - World Builder
    { section: 'MISSION_ROLES', key: 'role_worldBuilder_name', value: 'World Builder', order: 24 },
    { section: 'MISSION_ROLES', key: 'role_worldBuilder_title', value: 'Company / Partner', order: 25 },
    { section: 'MISSION_ROLES', key: 'role_worldBuilder_mission', value: 'Help expand the World Seed Bank through investment or collaboration.', order: 26 },

    // Mission Cards Section (New Website)
    { section: 'MISSION_CARDS', key: 'title', value: 'Every Class Has a Mission', order: 1 },
    { section: 'MISSION_CARDS', key: 'subtitle', value: 'Each mission is a new step in the adventure — start your training, unlock stories, take action, and protect real seeds.', order: 2 },
    // Mission 1
    { section: 'MISSION_CARDS', key: 'mission1_ageRange', value: 'Ages 5-10', order: 3 },
    { section: 'MISSION_CARDS', key: 'mission1_title', value: 'Build a Seed Collection', order: 4 },
    { section: 'MISSION_CARDS', key: 'mission1_description', value: 'Students adopt heritage fruits and vegetables, color their cards, and build a classroom Seed Wall.', order: 5 },
    { section: 'MISSION_CARDS', key: 'mission1_button', value: 'Start Collecting →', order: 6 },
    // Mission 2
    { section: 'MISSION_CARDS', key: 'mission2_ageRange', value: 'Ages 7-12', order: 7 },
    { section: 'MISSION_CARDS', key: 'mission2_title', value: 'Seed Guardian Book', order: 8 },
    { section: 'MISSION_CARDS', key: 'mission2_description', value: 'Students discover the Seed Guardians story and create their own pages linking imagination and real heritage foods.', order: 9 },
    { section: 'MISSION_CARDS', key: 'mission2_button', value: 'Become a Guardian →', order: 10 },
    // Mission 3
    { section: 'MISSION_CARDS', key: 'mission3_ageRange', value: 'Ages 12-17', order: 11 },
    { section: 'MISSION_CARDS', key: 'mission3_title', value: 'Heritage e-Market', order: 12 },
    { section: 'MISSION_CARDS', key: 'mission3_description', value: 'Students lead a real school market where parents order heritage products through a QR code.', order: 13 },
    { section: 'MISSION_CARDS', key: 'mission3_button', value: 'Start e-Market →', order: 14 },
    // Mission 4
    { section: 'MISSION_CARDS', key: 'mission4_ageRange', value: 'Ages 12-17', order: 15 },
    { section: 'MISSION_CARDS', key: 'mission4_title', value: 'Build a Real Seed Bank', order: 16 },
    { section: 'MISSION_CARDS', key: 'mission4_description', value: 'Students become Master Guardians, helping track and protect real seeds with growers worldwide.', order: 17 },
    { section: 'MISSION_CARDS', key: 'mission4_button', value: 'Join the Waitlist →', order: 18 },

    // Seed Cards Section (New Website)
    { section: 'SEED_CARDS', key: 'title', value: 'The Seed Vault', order: 1 },
    { section: 'SEED_CARDS', key: 'subtitle', value: 'Explore the foods from your country that we can still protect — each one waiting for a new guardian. Learn their stories, adopt a seed, and help keep the world\'s flavors alive.', order: 2 },
    { section: 'SEED_CARDS', key: 'downloadPrintable', value: 'Download Printable', order: 3 },
    { section: 'SEED_CARDS', key: 'enterVault', value: 'Enter the Seed Vault', order: 4 },

    // Final CTA Section (New Website)
    { section: 'FINAL_CTA', key: 'title', value: 'Together, We Keep the Taste Alive', order: 1 },
    { section: 'FINAL_CTA', key: 'description', value: 'One seed, one fruit, one story at a time — we can keep the world\'s flavors alive for generations to come.', order: 2 },
    { section: 'FINAL_CTA', key: 'cta', value: 'Register Your Class', order: 3 },
    { section: 'FINAL_CTA', key: 'tagline', value: 'Protecting seeds, one class at a time', order: 4 },

    // Footer Section (New Website)
    { section: 'FOOTER', key: 'about_description', value: 'Connecting schools, families, and growers to protect food heritage worldwide.', order: 1 },
    { section: 'FOOTER', key: 'copyright', value: '© 2024 Taste & Grow. Protecting food heritage worldwide.', order: 2 },
  ];

  for (const content of websiteContent) {
    await prisma.websiteContent.create({
      data: content as any,
    });
  }

  console.log(`✅ Created ${websiteContent.length} website content items\n`);

  console.log('🌱 Creating seed cards...\n');

  // ========== SEED CARDS ==========
  // Convert status from "At Risk" to "AtRisk" for database
  const convertStatus = (status: string): string => {
    if (status === 'At Risk') return 'AtRisk';
    return status;
  };

  const seedCardsData = [
    // 12 Unlocked Seeds
    {
      seedId: 'PT-APP-0001',
      commonName: 'Maçã Bravo de Esmolfe',
      scientific: 'Malus domestica \'Bravo de Esmolfe\'',
      type: 'Fruit',
      region: 'Beira Alta (Mainland PT)',
      status: convertStatus('Heritage'),
      era: 'Heritage',
      rarity: 'Rare',
      ageYears: 200,
      story: 'Fragrant PDO apple from high, cool valleys.',
      tasteProfile: { sweetness: 70, acidity: 55, complexity: 78 },
      images: ['/src/assets/seeds/apple-green-poly.png'],
      sources: ['DGADR', 'INIAV'],
      featured: true,
      locked: false,
      order: 1,
      active: true,
    },
    {
      seedId: 'PT-PEAR-0002',
      commonName: 'Pêra Rocha',
      scientific: 'Pyrus communis \'Rocha\'',
      type: 'Fruit',
      region: 'Oeste (Mainland PT)',
      status: convertStatus('Heritage'),
      era: 'Heritage',
      rarity: 'Common',
      ageYears: 180,
      story: 'Crisp, floral pear with protected status.',
      tasteProfile: { sweetness: 60, acidity: 45, complexity: 62 },
      images: ['/src/assets/seeds/pear-poly.png'],
      sources: ['DGADR'],
      featured: true,
      locked: false,
      order: 2,
      active: true,
    },
    {
      seedId: 'PT-PEAR-0003',
      commonName: 'Pêra São Bartolomeu',
      scientific: 'Pyrus communis \'São Bartolomeu\'',
      type: 'Fruit',
      region: 'Beira Baixa (Mainland PT)',
      status: convertStatus('At Risk'),
      era: 'Ancestral',
      rarity: 'Rare',
      ageYears: 250,
      story: 'Traditional drying pear with intense aroma.',
      tasteProfile: { sweetness: 72, acidity: 38, complexity: 75 },
      images: ['/src/assets/seeds/pear-poly.png'],
      sources: ['DGADR'],
      featured: true,
      locked: false,
      order: 3,
      active: true,
    },
    {
      seedId: 'PT-WHE-0004',
      commonName: 'Trigo Barbela',
      scientific: 'Triticum aestivum \'Barbela\'',
      type: 'Grain',
      region: 'Centro (Mainland PT)',
      status: convertStatus('Endangered'),
      era: 'Ancestral',
      rarity: 'Legendary',
      ageYears: 800,
      story: 'Ancient Portuguese wheat revived by guardians.',
      tasteProfile: { sweetness: 35, acidity: 40, complexity: 82 },
      images: ['/src/assets/seeds/wheat-poly.png'],
      sources: ['SlowFood Ark', 'INIAV'],
      featured: true,
      locked: false,
      order: 4,
      active: true,
    },
    {
      seedId: 'PT-WHE-0005',
      commonName: 'Trigo Preto Amarelo',
      scientific: 'Triticum aestivum \'Preto Amarelo\'',
      type: 'Grain',
      region: 'Norte (Mainland PT)',
      status: convertStatus('Endangered'),
      era: 'Ancestral',
      rarity: 'Legendary',
      ageYears: 600,
      story: 'Dark-hulled wheat preserved by few growers.',
      tasteProfile: { sweetness: 30, acidity: 42, complexity: 80 },
      images: ['/src/assets/seeds/wheat-poly-2.png'],
      sources: ['INIAV'],
      featured: true,
      locked: false,
      order: 5,
      active: true,
    },
    {
      seedId: 'PT-CHS-0006',
      commonName: 'Castanha Longal',
      scientific: 'Castanea sativa \'Longal\'',
      type: 'Nut',
      region: 'Trás-os-Montes (Mainland PT)',
      status: convertStatus('Heritage'),
      era: 'Ancestral',
      rarity: 'Common',
      ageYears: 350,
      story: 'Firm, sweet chestnut from mountain orchards.',
      tasteProfile: { sweetness: 65, acidity: 25, complexity: 70 },
      images: ['/src/assets/seeds/chestnut-poly.png'],
      sources: ['ISA', 'INIAV'],
      featured: true,
      locked: false,
      order: 6,
      active: true,
    },
    {
      seedId: 'PT-CHS-0007',
      commonName: 'Castanha Judia',
      scientific: 'Castanea sativa \'Judia\'',
      type: 'Nut',
      region: 'Trás-os-Montes (Mainland PT)',
      status: convertStatus('Heritage'),
      era: 'Ancestral',
      rarity: 'Common',
      ageYears: 400,
      story: 'Large, aromatic chestnut used for roasting.',
      tasteProfile: { sweetness: 68, acidity: 22, complexity: 72 },
      images: ['/src/assets/seeds/chestnut-poly.png'],
      sources: ['ISA'],
      featured: false,
      locked: false,
      order: 7,
      active: true,
    },
    {
      seedId: 'PT-CHS-0008',
      commonName: 'Castanha Martaínha',
      scientific: 'Castanea sativa \'Martaínha\'',
      type: 'Nut',
      region: 'Beira Interior (Mainland PT)',
      status: convertStatus('Heritage'),
      era: 'Ancestral',
      rarity: 'Rare',
      ageYears: 300,
      story: 'Regional pillar with silky texture.',
      tasteProfile: { sweetness: 66, acidity: 24, complexity: 69 },
      images: ['/src/assets/seeds/chestnut-poly.png'],
      sources: ['ISA'],
      featured: false,
      locked: false,
      order: 8,
      active: true,
    },
    {
      seedId: 'PT-FIG-0009',
      commonName: 'Figo Pingo de Mel',
      scientific: 'Ficus carica \'Pingo de Mel\'',
      type: 'Fruit',
      region: 'Centro/Sul (Mainland PT)',
      status: convertStatus('Heritage'),
      era: 'Ancestral',
      rarity: 'Common',
      ageYears: 350,
      story: 'Honey-drop fig prized in summer markets.',
      tasteProfile: { sweetness: 85, acidity: 20, complexity: 60 },
      images: ['/src/assets/seeds/peach-poly.png'],
      sources: ['DGADR'],
      featured: false,
      locked: false,
      order: 9,
      active: true,
    },
    {
      seedId: 'PT-CIT-0010',
      commonName: 'Limão Galego dos Açores',
      scientific: 'Citrus aurantifolia',
      type: 'Fruit',
      region: 'Azores (São Miguel, Terceira, Faial)',
      status: convertStatus('At Risk'),
      era: 'Heritage',
      rarity: 'Rare',
      ageYears: 400,
      story: 'Small, highly aromatic island lime-lemon.',
      tasteProfile: { sweetness: 35, acidity: 80, complexity: 68 },
      images: ['/src/assets/seeds/orange-poly.png'],
      sources: ['Azores Govt', 'DGADR'],
      featured: true,
      locked: false,
      order: 10,
      active: true,
    },
    {
      seedId: 'PT-MEL-0011',
      commonName: 'Meloa de Santa Maria (PGI)',
      scientific: 'Cucumis melo',
      type: 'Fruit',
      region: 'Azores (Santa Maria)',
      status: convertStatus('Heritage'),
      era: 'Heritage',
      rarity: 'Rare',
      ageYears: 200,
      story: 'Protected island melon with floral sweetness.',
      tasteProfile: { sweetness: 78, acidity: 28, complexity: 55 },
      images: ['/src/assets/seeds/peach-poly.png'],
      sources: ['DGADR'],
      featured: true,
      locked: false,
      order: 11,
      active: true,
    },
    {
      seedId: 'PT-BAN-0012',
      commonName: 'Banana da Madeira',
      scientific: 'Musa spp.',
      type: 'Fruit',
      region: 'Madeira',
      status: convertStatus('Heritage'),
      era: 'Heritage',
      rarity: 'Common',
      ageYears: 450,
      story: 'Historic island bananas from terraced farms.',
      tasteProfile: { sweetness: 75, acidity: 20, complexity: 58 },
      images: ['/src/assets/seeds/peach-poly.png'],
      sources: ['DGADR'],
      featured: false,
      locked: false,
      order: 12,
      active: true,
    },
    // Additional locked seeds
    {
      seedId: 'PT-ORG-0013',
      commonName: 'Laranja de Amares',
      scientific: 'Citrus sinensis \'Amares\'',
      type: 'Fruit',
      region: 'Minho (Mainland PT)',
      status: convertStatus('At Risk'),
      era: 'Heritage',
      rarity: 'Rare',
      ageYears: 180,
      story: 'Historic orange from northern valleys — fading fast.',
      tasteProfile: { sweetness: 68, acidity: 48, complexity: 60 },
      images: ['/src/assets/seeds/orange-poly.png'],
      sources: ['DGADR'],
      featured: false,
      locked: false,
      order: 13,
      active: true,
    },
    {
      seedId: 'PT-PCH-0013B',
      commonName: 'Pêssego da Cova da Beira',
      scientific: 'Prunus persica \'Cova da Beira\'',
      type: 'Fruit',
      region: 'Beira Baixa (Mainland PT)',
      status: convertStatus('Lost'),
      era: 'Heritage',
      rarity: 'Legendary',
      ageYears: 150,
      story: 'No longer grown — records only.',
      tasteProfile: { sweetness: 75, acidity: 42, complexity: 65 },
      images: ['/src/assets/seeds/peach-poly.png'],
      sources: ['Historical archives'],
      featured: false,
      locked: true,
      order: 14,
      active: true,
    },
  ];

  let seedCardsCreated = 0;
  for (const seedCard of seedCardsData) {
    try {
      await prisma.seedCard.create({
        data: seedCard as any,
      });
      seedCardsCreated++;
    } catch (error: any) {
      // Skip if seed already exists
      if (error.code !== 'P2002') {
        console.error(`Error creating seed card ${seedCard.seedId}:`, error.message);
      }
    }
  }

  console.log(`✅ Created ${seedCardsCreated} seed cards\n`);

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

  console.log('🌐 WEBSITE CONTENT: ' + websiteContent.length + ' content items');
  console.log(`   - Hero Section: 3 items`);
  console.log(`   - How It Works: 9 items`);
  console.log(`   - Food Kits: 2 items`);
  console.log(`   - Cinematic Intro: 6 items`);
  console.log(`   - Mission Roles: 26 items (7 roles + section headers)`);
  console.log(`   - Mission Cards: 18 items (4 missions)`);
  console.log(`   - Seed Cards: 4 items`);
  console.log(`   - Final CTA: 4 items`);
  console.log(`   - Footer: 2 items\n`);

  console.log('🌱 SEED CARDS: ' + seedCardsCreated + ' seed cards created');
  console.log(`   - Featured seeds: ${seedCardsData.filter(s => s.featured).length}`);
  console.log(`   - Unlocked seeds: ${seedCardsData.filter(s => !s.locked).length}`);
  console.log(`   - Locked seeds: ${seedCardsData.filter(s => s.locked).length}\n`);

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
