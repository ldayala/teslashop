import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class ProductImag{
    @PrimaryGeneratedColumn()
    id:number;

    @Column('text')
    url:string

    @ManyToOne(
        ()=>Product,
        product=>product.images,
        {
            onDelete:'CASCADE' //para que se se borra el producto borre la imagen en cascada
        }
    )
    product:Product

}