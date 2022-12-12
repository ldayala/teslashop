import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File , metadata: ArgumentMetadata) {
    const tamaño=1000000;
    if(!value)
      throw new BadRequestException("File is required");
        
    if(value.size>tamaño)
    throw new BadRequestException(`${value.size} has zise large than ${tamaño} `)
    
    const filetype= value.mimetype.split('/')[1]
    const validExtensions=['jpg','jpeg','png','git']

    if(!validExtensions.includes(filetype))
    throw new BadRequestException(`The extension file should be a of the followin ${validExtensions}`)
    
    
    return value;
  }
}
