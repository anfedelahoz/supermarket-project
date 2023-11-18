import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
