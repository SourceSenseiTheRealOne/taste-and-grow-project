// Prisma seeding script
// Note: Run this only after database migration is successful
// Usage: npm run prisma:seed

console.log('ℹ️  Prisma seeding is available after database migration.');
console.log('For now, use the API endpoints to create users:');
console.log('');
console.log('POST /auth/register - Register a new user');
console.log('POST /auth/register-teacher - Register a new teacher');
console.log('POST /auth/create-user - Create a user with specific role');
console.log('');
console.log('Example:');
console.log('{');
console.log('  "email": "teacher@example.com",');
console.log('  "username": "john_doe",');
console.log('  "password": "password123",');
console.log('  "role": "teacher"');
console.log('}');
