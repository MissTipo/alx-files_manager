const dbClient = require('../utils/db');
const { v4: uuidv4 } = require ('uuid');
const redisClient = require('../utils/redis');
const crypto = require('crypto');

const AuthController = {
    async connect(req, res) {
        const Authorization = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Basic ')) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const encodedCredentials  = authHeader.split(' ')[1];
        const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf-8');
        const [email, password] = decodedCredentials.split(':');

        //finding the user with the email and hashed password
        const user = await dbClient.db.collection('users').findOne({ email: email, password: crypto.creatHash('sha1').update(password).digest('hex') });
        if (!user) {
            return res.status(401).send({ error: 'Unauthorized' });
        }
        const token = uuidv4();

    // Create a key for storing in Redis
    const key = `auth_${token}`;

    // Store the user ID in Redis with the generated token as the key, valid for 24 hours
    await redisClient.setex(key, 24 * 60 * 60, user._id.toString());

    return res.status(200).json({ token });
  },

  async disconnect(req, res) {
    const token = req.headers['x-token'];

    // Retrieve the user based on the token
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Delete the token in Redis
    await redisClient.del(`auth_${token}`);

    return res.status(204).end();
  }
};

module.exports = AuthController;
