import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity';

@Module({
    imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
    providers: [SupermercadoService]
})


export class SupermercadoModule {}
