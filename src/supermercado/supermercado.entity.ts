import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class SupermercadoEntity {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column()
nombre: string; 

@Column()
longitud: number;

@Column()
latitud: number;

@Column()
pagina_web: string;

@ManyToMany(() => CiudadEntity, ciudad => ciudad.supermercados)
ciudades: CiudadEntity[];
}


