export abstract class RepositoryAbstract<T> {
  abstract findById(id: string): Promise<T | null>;
  abstract findAll(filter?: any): Promise<T[]>;
  abstract create(entity: Partial<T>): Promise<T>;
  abstract update(id: string, entity: Partial<T>): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
}