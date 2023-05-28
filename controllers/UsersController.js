// const { objectId } = require('mongodb');
// const dbClient = require('../utils/db');
// const redisClient = require('../utils/redis')
const crypto = require('crypto');
const dbClient = require('../utils/db');

const UsersController = {
  async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    } else if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    try {
      //finding user by email
      const usersCollection = dbClient.DB.collection('users');
      const existingUser = await usersCollection.findOne({ email: email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exists' });
      }

      //creating a new user and  hashing the password
      const hashedPassword = crypto.createHash('sha1').update(password).digest('hex');
      const newUser = { email: email, password: hashedPassword };
      const result = await usersCollection.insertOne(newUser);
      const userId = result.insertedId;


      //return  hasheduserid created and email
      return res.status(201).json({ id: userId, email });
    } catch (error) {
      console.error('Error creating user:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

module.exports = UsersController;


//   async postNew(req, res) {
//     const email = req.body.email;
//     if (!email) {
//       return res.status(400).json({ error: 'Missing email' });
//     }
//     const password = req.body.password
//     if (!password) {
//       return res.status(400).json({ error: 'Missing password' })
//     }
//     const existingEmail = await dbClient.usersCollection('users').findOne({ email: email });
//     if (existingEmail) {
//       return res.status(400).json({ error: 'Already exist' });
//     }
//     const hashedPassword = sha1(password);
//     const user = await dbClient.usersCollection('users').insertOne({ email: email, password: hashedPassword });
//     const userId = user.insertedId;
//     return res.status(201).json({ id: userId, email: email });
//   }
// }
