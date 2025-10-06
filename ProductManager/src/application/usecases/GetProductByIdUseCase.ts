import type { ProductRepository } from '../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../domain/ports/ProductOutputPort.js'
import { toProductData } from '../../domain/entities/Product.js'

export class GetProductByIdUseCase {
  constructor(
    private readonly repository: ProductRepository,
    private readonly presenter: ProductOutputPort
  ) {}

  public async execute(id: string): Promise<void> {
    try {
      const product = await this.repository.findById(id)

      if (!product) {
        throw new Error(`Product with ID ${id} not found.`)
      }

      this.presenter.presentProduct(toProductData(product))
    } catch (error) {
      if (error instanceof Error) {
        this.presenter.presentError(error)
      } else {
        this.presenter.presentError(
          new Error('An unknown error occurred while fetching the product.')
        )
      }
    }
  }
}
