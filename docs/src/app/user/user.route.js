import {Router} from 'express';
import { withCache } from '../../lib/cache/withCache.js';
import { toSeconds } from '../../pkg/utils/time/time.js';
import{user}from"./model/user.model.js";
import { uploadSingleFile } from '../../lib/media/multer.js';
import { fileValidation, allowedFields } from '../../lib/media/file.validation.js';
import* as userRepository from './repository/user.repository.js';
import * as userController from './controller/user.controller.js';
const userRouter=Router();
userRouter.get('/get-all-users',
    withCache(),
    async(req,res,next)=>{
        const users=await user.find();
        res.json(users);
    }
)
userRouter.post('/upload-profile-pic',
    uploadSingleFile('pp',['image/png','image/jpeg']),
    fileValidation(),
    (req,res,next)=>{
    console.log(req.file);
    res.json('ok')
});
userRouter.post('/upload-cv',uploadSingleFile('cv',allowedFields.files),(req,res,next)=>{
    fileValidation(allowedFields.files),
    console.log(req.file);
    res.json('ok')
});  
userRouter.post('/upload-cover-images',uploadSingleFile('cover-images'),(req,res,next)=>{
    console.log(req.file);
    res.json('ok')
});  
userRouter.patch('/ban-user/:userId', userController.banUser);
export default userRouter;