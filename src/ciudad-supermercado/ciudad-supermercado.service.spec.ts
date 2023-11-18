import { Test, TestingModule } from '@nestjs/testing';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadSupermercadoService', () => {
  let service: CiudadSupermercadoService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let ciudad: CiudadEntity;
  let supermercadoList : SupermercadoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadSupermercadoService],
    }).compile();

    service = module.get<CiudadSupermercadoService>(CiudadSupermercadoService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(getRepositoryToken(SupermercadoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();
    supermercadoList = [];

    for (let i = 0; i < 5; i++) {
      const supermercado: SupermercadoEntity = await supermercadoRepository.save({
        nombre: faker.lorem.sentence(),
        longitud: faker.number.int(),
        latitud: faker.number.int(),
        pagina_web: faker.internet.url(),
      })
      supermercadoList.push(supermercado);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      numero_habitantes: faker.number.int(),
      supermercados: supermercadoList
    })
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addSupermarketToCity should add a supermarket to a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.internet.url(),
    });

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      numero_habitantes: faker.number.int(),
    })

    const result: CiudadEntity = await service.addSupermarketToCity(newCiudad.id, newSupermercado.id);

    expect(result.supermercados.length).toBe(1);
    expect(result.supermercados[0]).not.toBeNull();
    expect(result.supermercados[0].nombre).toBe(newSupermercado.nombre)
    expect(result.supermercados[0].longitud).toBe(newSupermercado.longitud)
    expect(result.supermercados[0].latitud).toBe(newSupermercado.latitud)
  });

  it('addSupermarketToCity should thrown exception for an invalid supermarket', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: faker.location.country(),
      numero_habitantes: faker.number.int(),
      supermercados: supermercadoList
    })

    await expect(() => service.addSupermarketToCity(newCiudad.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('addSupermarketToCity should throw an exception for an invalid supermarket', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.internet.url(),
    }); 

    await expect(() => service.addSupermarketToCity("0", newSupermercado.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });
  
  it('findSupermarketFromCity should return supermarket by city', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    const storedSupermercado: SupermercadoEntity = await service.findSupermarketFromCity(ciudad.id, supermercado.id);
    expect(storedSupermercado).not.toBeNull();
    expect(storedSupermercado.nombre).toBe(supermercado.nombre);
    expect(storedSupermercado.longitud).toBe(supermercado.longitud);
    expect(storedSupermercado.latitud).toBe(supermercado.latitud);
    expect(storedSupermercado.pagina_web).toBe(supermercado.pagina_web);
  });

  it('findSupermarketFromCity should throw an exception for an invalid supermarket', async () => {
    await expect(() => service.findSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('findSupermarketFromCity should throw an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await expect(() => service.findSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('findSupermarketFromCity should throw an exception for a supermarket not associated to the city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.internet.url(),
    });

    await expect(() => service.findSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "The supermarket with the given id is not associated to the city");
  });

  it('findSupermarketsFromCity should return supermarkets by city', async () => {
    const supermercados: SupermercadoEntity[] = await service.findSupermarketsFromCity(ciudad.id);
    expect(supermercados.length).toBe(5)
  });

  it('findSupermarketsFromCity should throw an exception for an invalid city', async () => {
    await expect(() => service.findSupermarketsFromCity("0")).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('updateSupermarketsCity should update supermarkets list for a city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.internet.url(),
    });

    const updatedCiudad: CiudadEntity = await service.updateSupermarketsFromCity(ciudad.id, [newSupermercado]);
    expect(updatedCiudad.supermercados.length).toBe(1);
    expect(updatedCiudad.supermercados[0].nombre).toBe(newSupermercado.nombre);
    expect(updatedCiudad.supermercados[0].latitud).toBe(newSupermercado.latitud);
    expect(updatedCiudad.supermercados[0].longitud).toBe(newSupermercado.longitud);
    expect(updatedCiudad.supermercados[0].pagina_web).toBe(newSupermercado.pagina_web);
  });

  it('updateSupermarketsCity should throw an exception for an invalid city', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.internet.url(),
    });

    await expect(() => service.updateSupermarketsFromCity("0", [newSupermercado])).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('updateSupermarketsCity should throw an exception for an invalid supermarket', async () => {
    const newSupermercado: SupermercadoEntity = supermercadoList[0];
    newSupermercado.id = "0";

    await expect(() => service.updateSupermarketsFromCity(ciudad.id, [newSupermercado])).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('deleteSupermarketFromCity should remove a supermarket from a city', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];

    await service.deleteSupermarketFromCity(ciudad.id, supermercado.id);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({ where: { id: ciudad.id }, relations: ["supermercados"] });
    const deletedSupermercado: SupermercadoEntity = storedCiudad.supermercados.find(r => r.id === supermercado.id);

    expect(deletedSupermercado).toBeUndefined();

  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid supermarket', async () => {
    await expect(() => service.deleteSupermarketFromCity(ciudad.id, "0")).rejects.toHaveProperty("message", "The supermarket with the given id was not found");
  });

  it('deleteSupermarketFromCity should thrown an exception for an invalid city', async () => {
    const supermercado: SupermercadoEntity = supermercadoList[0];
    await expect(() => service.deleteSupermarketFromCity("0", supermercado.id)).rejects.toHaveProperty("message", "The city with the given id was not found");
  });

  it('deleteSupermarketFromCity should thrown an exception for an non asocciated supermercado', async () => {
    const newSupermercado: SupermercadoEntity = await supermercadoRepository.save({
      nombre: faker.lorem.sentence(),
      longitud: faker.number.int(),
      latitud: faker.number.int(),
      pagina_web: faker.internet.url(),
    });

    await expect(() => service.deleteSupermarketFromCity(ciudad.id, newSupermercado.id)).rejects.toHaveProperty("message", "The supermarket with the given id is not associated to the city");
  });
});
