const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.production' });

async function listUsers() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('wallet-app1');
    const users = await db.collection('users').find({}).toArray();
    
    console.log('Users in database:');
    console.log(JSON.stringify(users, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

listUsers();
