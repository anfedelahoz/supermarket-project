import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { CiudadSupermercadoController } from './ciudad-supermercado.controller';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  providers: [CiudadSupermercadoService],
  controllers: [CiudadSupermercadoController]
})
export class CiudadSupermercadoModule {}
