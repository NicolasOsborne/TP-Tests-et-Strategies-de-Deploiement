import { Product, toProductData } from '../../domain/entities/Product.js'
import type { ProductRepository } from '../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../domain/ports/ProductOutputPort.js'

export interface CreateProductInput {
  name: string
  description: string
  price: number
  stock: number
}

export class CreateProductUseCase {
  constructor(
    private readonly repository: ProductRepository,
    private readonly presenter: ProductOutputPort
  ) {}

  public async execute(input: CreateProductInput): Promise<void> {
    try {
      const newProduct = new Product(
        input.name,
        input.description,
        input.price,
        input.stock
      )

      const savedProduct = await this.repository.save(newProduct)

      this.presenter.presentProduct(toProductData(savedProduct))
    } catch (error) {
      if (error instanceof Error) {
        this.presenter.presentError(error)
      } else {
        this.presenter.presentError(
          new Error('An unknown error occurred during product creation.')
        )
      }
    }
  }
}
