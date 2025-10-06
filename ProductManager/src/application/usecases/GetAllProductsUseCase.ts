import type { ProductRepository } from '../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../domain/ports/ProductOutputPort.js'
import { toProductData } from '../../domain/entities/Product.js'

export class GetAllProductsUseCase {
  constructor(
    private readonly repository: ProductRepository,
    private readonly presenter: ProductOutputPort
  ) {}

  public async execute(): Promise<void> {
    try {
      const products = await this.repository.findAll()

      const productDataList = products.map(toProductData)

      this.presenter.presentProductList(productDataList)
    } catch (error) {
      if (error instanceof Error) {
        this.presenter.presentError(error)
      } else {
        this.presenter.presentError(
          new Error('An unknown error occurred while fetching all products.')
        )
      }
    }
  }
}
