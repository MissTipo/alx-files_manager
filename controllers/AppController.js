// controllers/AppController.js
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

const AppController  = {
    async getStatus(req, res) {
    const redisStatus = redisClient.isAlive();
    const dbStatus = dbClient.isAlive();

    res.status(200).json({
      "redis": `${redisStatus}`,
      "db": `${dbStatus}`,
    });
  },

    async getStats(req, res) {
    const userCount = await dbClient.nbUsers();
    const fileCount = await dbClient.nbFiles();

    res.status(200).json({
      "users": `${userCount}`,
      "files": `${fileCount}`,
    });
  }
}

export default AppController;
