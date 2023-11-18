import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { BusinessErrorsInterceptor } from 'src/shared/interceptors/business-errors/business-errors.interceptor';
import { SupermercadoDto } from 'src/supermercado/supermercado.dto';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {

    constructor(private readonly ciudadSupermercadoService: CiudadSupermercadoService){}

    @Post(':cityId/supermarkets/:supermarketId')
    async addSupermarketToCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.ciudadSupermercadoService.addSupermarketToCity(cityId, supermarketId);
    }

    
    @Get(':cityId/supermarkets/:supermarketId')
   async findSupermarketByCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.ciudadSupermercadoService.findSupermarketFromCity(cityId, supermarketId);
   }

   @Get(':cityId/supermarkets')
   async findSupermarketsByCity(@Param('cityId') cityId: string){
       return await this.ciudadSupermercadoService.findSupermarketsFromCity(cityId);
   }

   @Put(':cityId/supermarkets')
   async updateSupermarketsFromCity(@Body() supermercadosDto: SupermercadoDto[], @Param('cityId') cityId: string){
       const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto)
       return await this.ciudadSupermercadoService.updateSupermarketsFromCity(cityId, supermercados);
   }

   @Delete(':cityId/supermarkets/:supermarketId')
    @HttpCode(204)
    async deleteSupermarketFromCity(@Param('cityId') cityId: string, @Param('supermarketId') supermarketId: string){
       return await this.ciudadSupermercadoService.deleteSupermarketFromCity(cityId, supermarketId);
   }


}
