import * as bcrypt from 'bcrypt';

const password = 'rimadima6';
const saltRounds = 10;

bcrypt.hash(password, saltRounds).then(hash => {
  console.log('\n✅ для backend/.env:');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
}).catch(err => {
  console.error('Ошибка:', err);
});