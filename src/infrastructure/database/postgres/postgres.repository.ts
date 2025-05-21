import { ObjectLiteral, Repository as TypeOrmRepository, FindOptionsWhere } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { RepositoryAbstract } from '../../../core/interfaces/repository/base-repository.interface';

@Injectable()
export abstract class PostgresqlRepository<T extends ObjectLiteral> implements RepositoryAbstract<T> {
  constructor(protected readonly repository: TypeOrmRepository<T>) {}

  async findById(id: string): Promise<T | null> {
    const entity = await this.repository.findOne({
      where: { id } as unknown as FindOptionsWhere<T>
    });
    return entity || null;
  }

  async findAll(filter?: any): Promise<T[]> {
    return await this.repository.find({
      where: filter as unknown as FindOptionsWhere<T>
    });
  }

  async create(entity: T): Promise<T> {
    const newEntity = this.repository.create(entity as any);
    return await this.repository.save(newEntity as unknown as T) as T;
  }

  async update(id: string, entity: T): Promise<T | null> {
    await this.repository.update(id, entity as any);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}