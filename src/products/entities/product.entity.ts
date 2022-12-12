//import { text } from 'stream/consumers';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from 'typeorm';
import { ProductImag } from './product-image.entity';

@Entity({name:'products'})
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('text', {
        unique: true
    })
    title: string

    @Column('float', {
        default: 0
    })
    price: number

    @Column({
        nullable: true,
        type: 'text'
    })
    description: string

    @Column('text', {
        unique: true
    })
    slug: string

    @Column('int', {
        default: 0
    })
    stock: number

    @Column('text', {
        array: true
    })
    sizes: string[]

    @Column('text')
    gender: string
    
    @Column('text',{
        array:true,
        default:[]
    })
    tags:string[]

    @OneToMany(
        ()=>ProductImag,
        productImage=>productImage.product,
        {cascade:true,//para si se elimina un producto esto ayuda a eliminar la imagenes relacionadas al producto
        eager:true // cada vez que utilizamos un metodo find nos carga las relaciones, no asi con queryResult
        }
        )
    images?:ProductImag[]

    @BeforeInsert()
    checkSlugInsert() {
        if (!this.slug)
            this.slug = this.title

        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
         this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'", '')
    }



}
