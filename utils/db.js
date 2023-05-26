const { MongoClient } = require('mongodb');

require('dotenv').config();
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';

const DB = `${DB_DATABASE}`;
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
    constructor() {
        this.client = new MongoClient(url);
        this.connected = false;
        this.connect();
    }

    async connect() {
        try {
            await this.client.connect();
            this.DB = this.client.db(DB);
            this.connected = true;
            console.log('Connected to MongoDB');
        } catch (error) {
            console.error('Error connecting to MongoDB:', error);
            throw error;
        }
    }

    isAlive() {
        return this.connected;
    }

    async nbUsers() {
        try {
            const count = await this.DB.collection('users').countDocuments({});
            return count;
        } catch (error) {
            console.error('Error retrieving number of users:', error);
            throw error;
        }
    }

    async nbFiles() {
        try {
            const count = await this.DB.collection('files').countDocuments({});
            return count;
        } catch (error) {
            console.error('Error retrieving number of files:', error);
            throw error;
        }
    }
}

const dbClient = new DBClient();
module.exports = dbClient;

