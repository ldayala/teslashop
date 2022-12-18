import { Controller, Post, UseInterceptors, BadRequestException, Get, Param } from '@nestjs/common';

import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Res, UploadedFile } from '@nestjs/common/decorators'
import { diskStorage } from 'multer';
import { fileFilter,fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService:ConfigService
    ) { }

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,  //filtro que debe pasar la imagen para que pase
      limits: { fileSize: 10000000 }, // limites para controlar la image
      storage: diskStorage({
        destination: './static/products',
        filename:fileNamer
      })
    }))// para que intercepte el file que me envian y poder trabajar el archivo
  uploadFiles( @UploadedFile( )file: Express.Multer.File  ) {
    
   if(!file) throw new BadRequestException('The file cannot be empty')

   const secureUrl=`${this.configService.get('host_api')}/files/product/${file.filename}`

    return secureUrl;
       
  }


  @Get('product/:imageName')
  findProductImage(
    @Res( ) res:Response,
    @Param('imageName') imageName:string
    ){
  
   const path= this.filesService.getStaticProductImage(imageName)
   res.sendFile(path)
    
  }



}
