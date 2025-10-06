import { Product } from '../../domain/entities/Product.js'
import type { ProductRepository } from '../../domain/ports/ProductRepository.js'

export class InMemoryProductRepository implements ProductRepository {
  private readonly products: Map<string, Product> = new Map()

  async save(product: Product): Promise<Product> {
    if (this.products.has(product.id)) {
      return this.update(product)
    }
    this.products.set(product.id, product)
    return product
  }

  async findById(id: string): Promise<Product | null> {
    return this.products.get(id) || null
  }

  async update(product: Product): Promise<Product> {
    if (!this.products.has(product.id)) {
      throw new Error(`Product with id ${product.id} not found.`)
    }
    this.products.set(product.id, product)
    return product
  }

  async delete(id: string): Promise<void> {
    if (!this.products.has(id)) {
      throw new Error(`Product with id ${id} not found for deletion.`)
    }
    this.products.delete(id)
  }

  async findAll(): Promise<Product[]> {
    return Array.from(this.products.values())
  }
}
