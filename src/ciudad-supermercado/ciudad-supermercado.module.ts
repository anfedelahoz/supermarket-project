import { Module } from '@nestjs/common';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity])],
  providers: [CiudadSupermercadoService]
})
export class CiudadSupermercadoModule {}
