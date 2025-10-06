import { Product } from '../entities/Product.js'

export interface ProductRepository {
  save(product: Product): Promise<Product>
  findById(id: string): Promise<Product | null>
  update(product: Product): Promise<Product>
  delete(id: string): Promise<void>
  findAll(): Promise<Product[]>
}
