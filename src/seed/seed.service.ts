import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed-data';



@Injectable()
export class SeedService {
  
  constructor(
    
    private readonly productsService:ProductsService
  ){}

  async runSeed(){
   this.insertProducts()
   return "seed executed correctly"
   
  }

  async insertProducts(){
   this.productsService.deleteAllProduct()
   const products= initialData.products

   const allPromises=[];

   products.map(pro=>allPromises.push(this.productsService.create(pro)))

   await Promise.all(allPromises)

   return true;
    
  }
}
