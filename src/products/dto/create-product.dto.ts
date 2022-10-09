import { IsString, IsNotEmpty, MinLength, IsNumber, IsOptional, IsPositive, IsInt, IsArray, IsIn } from "class-validator"

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    title: string

    @IsNumber()
    @IsOptional()
    @IsPositive()
    price?: number

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsOptional()
    slug?: string

    @IsOptional()
    @IsInt()
    @IsPositive()
    stock?: number

    @IsString({ each: true })//para que cada elemento sea un string
    @IsArray()
    sizes: string[]

    @IsOptional()
    @IsArray()
    @IsString({each:true})
    tags?:string[]

    @IsIn(['woman', 'man', 'kid', 'unisex']) //para que el valor este de de uno de los elementos del arreglo
    gender: string
}
