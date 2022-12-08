import { NotFoundException } from '@nestjs/common';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isUUID } from 'class-validator';
import { ProductImag } from './entities';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService') //para aporvechar log de consola de jest para mostrar los mensajes de error
  //en este proyecto vamos a trabajar con el patron repositorio
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImag)
    private readonly productImagRepository: Repository<ProductImag>,

    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {

    const { images = [], ...productDetails } = createProductDto
    try {
      const product = this.productRepository.create({
        ...createProductDto,
        //no es necesario agregar el producto en el create porque como lo hacemos dentro de la creacion del producto typeorm lo asume
        images: images.map(imag => this.productImagRepository.create({ url: imag }))
      }) //creamos el porducto para guardar en la db
      await this.productRepository.save(product); // salva tanto el producto como la imagen

      return { ...product, images }
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    })


    return products.map(product => ({
      ...product,
      images: product.images.map(ima => ima.url)
    }))
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    }
    else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); //le ponemos un alias a la trabla pro para la relacione
      product = await queryBuilder
        .where('UPPER(title)=:title or slug=:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase()
        }).leftJoinAndSelect('prod.images', 'prodImages')//le ponemos un alias a la tabla images por si tuvieramos otra relacion
        .getOne()// only one result

    }

    if (!product)
      throw new NotFoundException(`Product with id: ${term} not found`)
    return product
  }

  async plainProduct(term: string) {

    const { images = [], ...rest } = await this.findOne(term)
    return {
      rest,
      images: images.map(imag => imag.url)
    }
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...updateProduct } = updateProductDto
    //no sobreescribo la imagenes porque estas pueden venir vacias
    //el repository.preload no carga las relaciones de tablas
    const product = await this.productRepository.preload({//busca un producto por el id y le sobreescribe los atributos  ...updateProductDto
      id,
      ...updateProduct,
    })
    if (!product) throw new NotFoundException(`product with id ${id} not found`)
    //create query runner
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect() //conectamos a la db
    await queryRunner.startTransaction() //iniciamos la transaccion, todo lo que venga despues esta dentro de la transaccion

    try {
      //si en images viene un arreglo vacion significa que quiere borrar todas las imagenes
      //y es un array de imagenes, significa que quiere borrar la antiguas y poner las del array
      if (images) {
        // en este caso se pone product porque la columna es producto a una relacion y se llama asi , pero tambien se podria pone productId
        await queryRunner.manager.delete(ProductImag, { product: { id } })
        product.images = images.map(
          ima => this.productImagRepository.create({ url: ima })
        )   
        
      }
      await queryRunner.manager.save(product);
     

      //await this.productRepository.save(product);
      
      await queryRunner.commitTransaction();
      await queryRunner.release(); //liberamos el queryRunner
           
      return this.plainProduct(id);
    } catch (error) {
      
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error)
    }

  }



  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productRepository.remove(product)
    return `This action removes a #${id} product`;
  }

  private handleDBExceptions(error: any) {

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    this.logger.error(error)
    throw new InternalServerErrorException("Unexpected error, check server logs");

  }
  //this method only is used in prod for delete all seed product
  async deleteAllProduct(){
   const query= this.productRepository.createQueryBuilder('product');

   try {
    await query
            .delete()
            .where({})
            .execute()
   } catch (error) {
    this.handleDBExceptions(error)
   }

  }
}
