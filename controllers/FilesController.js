const dbClient = require("../utils/db");
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const FilesController = {
    async postUpload(req, res) {
        const token = req.headers['x-token'];
        // const { name, type, parentId, isPublic, data } = req.body;

        const user = await dbClient.getuserId(token);
        // console.log({user})
        if(!user){
            return res.status(401).json({ error: 'Unauthorized' });
        }

        //validate the payload 
        const {error, value} = validateSchema(req.body, postUploadSchema);
        if(error){
            console.log(error);
        }

        const{name, type, data } = value;

        if(!name){
            return res.status(400).json({ error: 'Missing name' });
        }

        const fileTypes = ['folder', 'file', 'image'];
        if((type === 'file' || type === 'image') && !data){
            return res.status(400).json({ error: 'Missing data' });
        }

        //setting position fields with default values

        const parentId = value.parentId || 0;
        const isPublic = value.isPublic || false;

        //check if parent exists or set
        if(parentId !== 0){
            const parent = await dbClient.getFile(parentId);
        }

        //create a new file
        const file = {
        id: uuidv4(),
        name,
        type,
        parentId,
        isPublic,
        userId: user._id, 
        };
        console.log({file})

        await dbClient.createFile(file);
    }
    
};