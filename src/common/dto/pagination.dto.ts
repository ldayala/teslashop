import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";


export class PaginationDto{
    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Type(()=>Number) //convertimos el query a tipo de dato
    limit?:number;

    @IsOptional()
    @IsNumber()
    @IsPositive()
    @Min(0)
    @Type(()=>Number)
    offset?:number
    
}