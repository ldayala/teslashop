import { NotFoundException } from '@nestjs/common';
import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { isUUID } from 'class-validator';


@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService') //para aporvechar log de consola de jest para mostrar los mensajes de error
  //en este proyecto vamos a trabajar con el patron repositorio
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>
  ) { }

  async create(createProductDto: CreateProductDto) {

    try {
      const product = this.productRepository.create(createProductDto) //creamos el porducto para guardar en la db
      await this.productRepository.save(product);

      return product
    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      take: limit,
      skip: offset

      //TODO:
    })


    return products;
  }

  async findOne(term: string) {
    let product: Product;
    if (isUUID(term)) {
      product = await this.productRepository.findOneBy({ id: term })
    }
    else {
      const queryBuilder =  this.productRepository.createQueryBuilder();
      product = await queryBuilder
                  .where('(UPPER)title=:title or slug=:slug',{ 
                    title:term.toUpperCase(),
                    slug:term.toLowerCase()
                  }).getOne()// only one result
                  
    }

    if (!product)
      throw new NotFoundException(`Product with id: ${term} not found`)
    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
   const product= await this.productRepository.preload({//busca un producto por el id y le sobreescribe los atributos  ...updateProductDto
    id:id,  
    ...updateProductDto
   })

   if (!product) throw new NotFoundException(`product with id ${id } not found`)
   try {
    await this.productRepository.save(product)
   } catch (error) {
    this.handleDBExceptions(error)
   }

   
   
   return product;
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
}
