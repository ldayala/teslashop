import { FileSizeValidationPipe } from '../../common/pipes/file-size-validation-pipe.pipe';
export const fileFilter=(req:Express.Request,file:Express.Multer.File,callback:Function)=>{
    const tamaño=10;
    if(!file) return callback(new Error('File is empty'),false)
      
    const filetype= file.mimetype.split('/')[1]
    const validExtensions=['jpg','jpeg','png','git']

    if(validExtensions.includes(filetype)) return callback(null,true)
     
    
    return callback(null,false);
}