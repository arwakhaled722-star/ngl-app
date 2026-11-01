import multer, { diskStorage } from'multer';
import crypto from 'node:crypto';
import { AppError } from '../error/error.js';

function multerUpload(allowedTypes=['image/png','image/jpeg']){
   return multer({
    fileFilter:function(req,file,cb){
        if(!allowedTypes.includes(file.mimetype)){
            return cb(new AppError('invalid file format',400),false);
        }
        cb(null,true);
    },
    storage :diskStorage({
        destination:'uploads',
        filename:function(req,file,cb){
            cb(null,file.originalname);
        }
    })
})

}
export function uploadSingleFile(filedName,allowedTypes=['image/png','image/jpeg']){
    return multerUpload(allowedTypes).single(filedName);
}
export function uploadFilesArray(filedName){
    return multerUpload().array(filedName);
}
export function uploadFields(fields){
    return multerUpload().fields(fields);
}