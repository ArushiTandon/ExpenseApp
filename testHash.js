const bcrypt = require('bcrypt');

// Replace this with the hashed password from your database
const storedHash = '$2b$10$BqCFdeOJT8Im4Evd7WuZ6OtWU6kT7X/NRf6QE0tRx54x7kgwcKw4q'; 
const plainPassword = 'test1'; // Password you want to test

async function testHashing() {
    // Generate a hash for the plain password
    const newHash = await bcrypt.hash(plainPassword, 10);
    console.log('Newly Generated Hash:', newHash);

    // Compare the plain password with the stored hash
    const isMatch = await bcrypt.compare(plainPassword, storedHash);
    console.log('Do they match?:', isMatch);
}

testHashing().catch(console.error);
