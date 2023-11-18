import { SupermercadoEntity } from 'src/supermercado/supermercado.entity';
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CiudadEntity {
 @PrimaryGeneratedColumn('uuid')
 id: string;

 @Column()
 nombre: string;
 
 @Column()
 pais: string;
 
 @Column()
 numero_habitantes: number;

 @ManyToMany(() => SupermercadoEntity, supermercado => supermercado.ciudades)
 supermercados: SupermercadoEntity[];
}
