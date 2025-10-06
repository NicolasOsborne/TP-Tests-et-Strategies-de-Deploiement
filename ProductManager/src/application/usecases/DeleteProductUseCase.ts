import type { ProductRepository } from '../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../domain/ports/ProductOutputPort.js'

export class DeleteProductUseCase {
  constructor(
    private readonly repository: ProductRepository,
    private readonly presenter: ProductOutputPort
  ) {}

  public async execute(id: string): Promise<void> {
    try {
      // Le repository peut déjà vérifier l'existence, mais le Use Case s'assure
      // que toute erreur de persistance est gérée et présentée.
      await this.repository.delete(id)

      this.presenter.presentSuccess(
        `Product with ID ${id} deleted successfully.`
      )
    } catch (error) {
      if (error instanceof Error) {
        this.presenter.presentError(error)
      } else {
        this.presenter.presentError(
          new Error('An unknown error occurred during product deletion.')
        )
      }
    }
  }
}
