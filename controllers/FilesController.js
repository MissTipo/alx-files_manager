const dbClient = require("../utils/db");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();
const redisClient = require('../utils/redis');
const { ObjectId } = require('mongodb');



const FilesController = {
    async postUpload(req, res) {
        const token = req.headers['x-token'];
        // console.log({token})
        //no key found
        const key = `auth_${token}`
        // console.log({key})
        const {name, type, data} = req.body
        let {parentId, isPublic} = req.body
        const userId = await redisClient.get(`auth_${token}`);
        // console.log({userId})

        if(!isPublic){
            isPublic =  false;
        }
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

        if(userId){
            const user = await dbClient.getuserId(userId);
            //user found
            // console.log({user})
            if(user) {
                if(!name){
                    return res.status(400).json({ error: 'Missing name' });
                } else if (!type) {
                    return res.status(400).json({ error: 'Missing type' });
                } else if (!data && type !=='folder') {
                    return res.status(400).json({ error: 'Missing data' });
                }
                if(parentId) {
                    // console.log({parentId})
                    const parentFile = await dbClient.getFileById(parentId);
                    if(!parentFile){
                        return res.status(400).json({ error: 'Parent not found' });
                    } else if (type !== 'folder') {
                        return res.status(400).json({ error: 'Parent not a folder' });
                    }
                } else {
                    parentId = 0;
                }
                const fileName = uuidv4();
                const filePath = `${folderPath}/${fileName}`;
                if (parentId !== 0){
                    parentId = filePath(parentId);
                }
                const userId = ObjectId(user._id);

                const fileData = await dbClient.addFile(
                    userId,
                    name,
                    type,
                    isPublic,
                    parentId,
                    filePath
                );
                //save file to disk
                 if (type !== 'folder') {
                        fs.mkdirSync(folderPath, { recursive: true });
                        const decodedData = Buffer.from(data, 'base64').toString('binary');
                        fs.writeFileSync(filePath, decodedData, (err) => {
                            if (err) throw err;
                        });
                    }
                    res.status(201).json({id: fileData, userId, name, type, isPublic, parentId}).end();

            } else {
                res.status(401).json({error: 'Unauthorized'});
        }
        } else {
            res.status(401).json({error: 'Unauthorized'});
        }
    },
    async getShow(req, res) {
        // if (req.body == get('/files')) {
        const token = req.headers['x-token'];
        const key = `auth_${token}`

        //getting userid from redis reverse lookup using token
        const userId = await redisClient.get(`auth_${token}`);
        console.log({userId});
        if(!userId){
            return res.status(401).json({error: 'Unauthorized'});
        }
        //checking if user is linked to the file or does not exist
        const fileId = req.params.id;
        console.log({fileId})
        const file = await dbClient.getFileById(fileId, userId);
        if(!file){
            return res.status(404).json({error: 'Not found'});
        } else {
            return res.status(200).json(file);
        }
    },
    async getIndex(req, res) {
        const token = req.headers['x-token'];
        const key = `auth_${token}`
        const userId = await redisClient.get(key);
            if(!userId){
                return res.status(401).json({error: 'Unauthorized'});
            }
            //getting userid from redis reverse lookup using token
            const user = await dbClient.getuserId(userId);
            console.log(user)
            const parentId = req.query.parentId || 0;
            // console.log(pr)
            const files = await dbClient.FilesByParentId(parentId);
            return res.status(200).json(files);
        }

        // console.log({parentId})
        // const parentId = await dbtClient.getFileById(parentId);
        // if(!parentId){
        //     return res.status(404).json({error: 'Not found'});
        // }


    }

module.exports = FilesController;