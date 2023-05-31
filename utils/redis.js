import { createClient } from 'redis';

class RedisClient {
  constructor () {
    this.client = createClient({
      host: 'localhost',
      port: 6379
    });
    this.connected = true;

    this.client.on('error', (err) => {
      this.connected = false;
      console.log(err);
    });
  }

  isAlive () {
    return this.connected;
  }

  async get (key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }

  async set (key, value, duration) {
    return new Promise((resolve, reject) => {
      this.client.set(key, duration, value, (error, reply) => {
        if (error) {
          reject(error);
        } else {
          resolve(reply);
        }
      });
    });
  }

  async del (key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (error, reply) => {
        if (error) {
          reject(error);
        } else {
          resolve(reply);
        }
      });
    });
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;

// console.log(redisClient.isAlive())
