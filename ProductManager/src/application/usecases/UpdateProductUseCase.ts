import { toProductData } from '../../domain/entities/Product.js'
import type { ProductRepository } from '../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../domain/ports/ProductOutputPort.js'

export interface UpdateProductInput {
  id: string
  name?: string
  description?: string
  price?: number
  stock?: number
}

export class UpdateProductUseCase {
  constructor(
    private readonly repository: ProductRepository,
    private readonly presenter: ProductOutputPort
  ) {}

  public async execute(input: UpdateProductInput): Promise<void> {
    try {
      const existingProduct = await this.repository.findById(input.id)

      if (!existingProduct) {
        throw new Error(`Product with ID ${input.id} not found for update.`)
      }

      if (input.name !== undefined) {
        existingProduct.updateName(input.name)
      }
      if (input.description !== undefined) {
        existingProduct.updateDescription(input.description)
      }
      if (input.price !== undefined) {
        existingProduct.changePrice(input.price)
      }
      if (input.stock !== undefined) {
        existingProduct.adjustStock(input.stock)
      }

      // 2. Persister l'entité mise à jour
      const updatedProduct = await this.repository.update(existingProduct)

      // 3. Présenter le résultat
      this.presenter.presentProduct(toProductData(updatedProduct))
    } catch (error) {
      if (error instanceof Error) {
        this.presenter.presentError(error)
      } else {
        this.presenter.presentError(
          new Error('An unknown error occurred during product update.')
        )
      }
    }
  }
}
