const { MongoClient, ObjectId } = require('mongodb')

class DBClient {
    constructor() {
        const DB_HOST = process.env.DB_HOST || 'localhost';
        const DB_PORT = process.env.DB_PORT || 27017;
        const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
        const DB = `${DB_DATABASE}`;
        const url = `mongodb://${DB_HOST}:${DB_PORT}/${DB}`;
        this.client = new MongoClient(url, { useUnifiedTopology: true });
        this.connected = false;
        this.connect();
    }

    async connect() {
            await this.client.connect();
            this.connected = true;
            this.DB = this.client.db('files_manager');
        } 

    isAlive() {
        return this.connected;
    }
    async nbUsers() {
            const count = await this.DB.collection('users').countDocuments({});
            return count;
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
    //getting user by id
    async getUserById(userId){
        const user = await this.client.db('files_manager').collection('users').findOne({_id:ObjectId(userId)});
        return user;
    }
    //getting user by token
    async getuserId(token){
        const user = await  this.client.db('files_manager').collection('users').findOne({_id:ObjectId(token)});
        return user;
    }
    //function to add a file
    async addFile(userId, name, type, isPublic, parentId, filePath) {
        const file = await this.client.db('files_manager').collection('files').insertOne({ userId: userId, name: name, type: type, isPublic: isPublic, parentId: parentId, filePath: filePath });
        return file.insertedId;
    }
    //function to get a file
    async getFileById(userId) {
        const file = await this.client
        .db('files_manager')
        .collection('files')
        .find({userId: ObjectId(userId)}).toArray();
        return file;
    }
    async FileByuserId(userId, page, parentId) {
        if(parentId === 0){
            if (page > 0) {
                const file = await this.client
                .db('files_manager')
                .collection('files')
                .aggregate([
                    { $match: { userId: ObjectId(userId), parentId: ObjectId(parentId) } 
                },
                    { $limit: 20 },
                ])
                .toArray();
                return file;
                // .findOne({userId: ObjectId(userId)});
            }
                const file = await this.client
                .db('files_manager')
                .collection('files')
                .aggregate([
                    { $match: { userId: ObjectId(userId), parentId: ObjectId(parentId) } 
                },
                { $limit: 20 },
                ])
                .toArray();
                return file;
        }
        return file;
    }

    async FilesByParentId(userId, parentId) {
        const file = await this.client.db('files_manager').collection('files').find({ userId: ObjectId(userId), parentId: ObjectId(parentId)}).toArray();
        return file;
    }
}


const dbClient = new DBClient();
module.exports = dbClient;
