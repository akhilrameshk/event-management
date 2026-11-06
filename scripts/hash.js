// Usage: npm run hash -- "your-admin-password"
// Prints the value to paste into .env.local as ADMIN_PASSWORD_HASH_B64
// (the bcrypt hash is base64 encoded because "$" characters break .env files).
const bcrypt = require('bcryptjs');
const pw = process.argv[2];
if (!pw) {
  console.error('Usage: npm run hash -- "your-password"');
  process.exit(1);
}
const hash = bcrypt.hashSync(pw, 10);
console.log('ADMIN_PASSWORD_HASH_B64=' + Buffer.from(hash).toString('base64'));
