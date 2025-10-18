import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create a dummy school
  const school = await prisma.school.create({
    data: {
      name: 'Green Valley Elementary School',
      address: '123 Education Street',
      city: 'Springfield',
      country: 'USA',
      phone: '+1 555-0123',
      email: 'contact@greenvalley.edu',
    },
  });

  console.log('Created school:', school.name);

  // Hash passwords for teachers
  const hashedPassword1 = await bcrypt.hash('password123', 10);
  const hashedPassword2 = await bcrypt.hash('password123', 10);

  // Create first teacher
  const teacher1 = await prisma.teacher.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@greenvalley.edu',
      password: hashedPassword1,
      schoolId: school.id,
    },
  });

  console.log('Created teacher:', teacher1.name);

  // Create second teacher
  const teacher2 = await prisma.teacher.create({
    data: {
      name: 'Michael Brown',
      email: 'michael.brown@greenvalley.edu',
      password: hashedPassword2,
      schoolId: school.id,
    },
  });

  console.log('Created teacher:', teacher2.name);

  console.log('\nSeed completed successfully!');
  console.log('\nDummy data created:');
  console.log('- School: Green Valley Elementary School');
  console.log('- Teacher 1: Sarah Johnson (sarah.johnson@greenvalley.edu / password123)');
  console.log('- Teacher 2: Michael Brown (michael.brown@greenvalley.edu / password123)');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

