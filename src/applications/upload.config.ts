import { BadRequestException } from '@nestjs/common';
import {diskStorage} from 'multer'
import { extname } from 'path';
import { callbackify } from 'util';


export const resumeUploadConfig = {
    storage:diskStorage({

        destination: './uploads/resume',

        // what to name the files
        // we use timestamp + random number to make names unique
        // so two people named "alice" don't overwrite each other
        filename: (req, file,callback)=> {
            const uniqueName = `${Date.now()}-${Math.round(Math.random() *1e9)}`;
            const extension =  extname(file.originalname);
            callback(null, `${uniqueName}${extension}`)
        }
    }),
    // file filter — only allow PDF files
    // if someone tries to upload a .exe or .jpg, reject it

  fileFilter: (req,file,callback) =>{
    if( file.mimetype !== 'application/pdf') {
            return callback(
                new BadRequestException('Only PDF files are allowed'),
                false
        )
        }
    callback(null, true)
  },

  //size limit - max 5MB

  limit:{
    fileSize: 5 * 1024 * 1024  //5MB
    }

}
