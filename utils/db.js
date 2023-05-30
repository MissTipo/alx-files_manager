const { MongoClient, ObjectId } = require('mongodb')
require('dotenv').config();
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';

const DB = `${DB_DATABASE}`;
const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB}`;

class DBClient {
    constructor() {
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.connected = false;
        this.DB = null;
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
    //getting user by email
    async getuser(email){
    const user = await this.client.db('files_manager').collection('users').findOne({email});
    console.log(user);
    return user;
    }
    //creeate user
    async createUser (email, password) {
      const user = await this.client.db('files_manager').collection('users').insertOne({ email: email, password: password }); 
      return user.insertedId;
    }
    async getuserId(token){
        const user = await  this.client.db('files_manager').collection('users').findOne({_id:ObjectId(token)});
        return user;
    }
}

const dbClient = new DBClient();
module.exports = dbClient;
