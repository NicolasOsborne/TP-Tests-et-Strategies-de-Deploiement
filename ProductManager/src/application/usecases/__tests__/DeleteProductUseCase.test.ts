import { DeleteProductUseCase } from '../DeleteProductUseCase.js'
import type { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../../domain/ports/ProductOutputPort.js'
import { jest } from '@jest/globals'

// Création des mocks
const mockRepository = {
  save: jest.fn<ProductRepository['save']>(),
  findById: jest.fn<ProductRepository['findById']>(),
  update: jest.fn<ProductRepository['update']>(),
  delete: jest.fn<ProductRepository['delete']>(),
  findAll: jest.fn<ProductRepository['findAll']>(),
} as jest.Mocked<ProductRepository>

const mockPresenter = {
  presentProduct: jest.fn<ProductOutputPort['presentProduct']>(),
  presentProductList: jest.fn<ProductOutputPort['presentProductList']>(),
  presentSuccess: jest.fn<ProductOutputPort['presentSuccess']>(),
  presentError: jest.fn<ProductOutputPort['presentError']>(),
} as jest.Mocked<ProductOutputPort>

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase
  const productId = 'prod-to-delete-123'

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new DeleteProductUseCase(mockRepository, mockPresenter)
  })

  // --- Scénario Nominal ---

  it('should successfully call repository delete and present success message', async () => {
    // Simuler la suppression réussie
    mockRepository.delete.mockResolvedValue(undefined)

    await useCase.execute(productId)

    // Vérification des interactions
    expect(mockRepository.delete).toHaveBeenCalledTimes(1)
    expect(mockRepository.delete).toHaveBeenCalledWith(productId)

    expect(mockPresenter.presentSuccess).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentSuccess).toHaveBeenCalledWith(
      `Product with ID ${productId} deleted successfully.`
    )
    expect(mockPresenter.presentError).not.toHaveBeenCalled()
  })

  // --- Scénarios d'Erreur ---

  it('should present an error if the repository delete operation fails', async () => {
    const repositoryError = new Error(
      `Product with id ${productId} not found for deletion.`
    )
    mockRepository.delete.mockRejectedValue(repositoryError) // Simule l'erreur (ex: non trouvé dans l'adaptateur)

    await useCase.execute(productId)

    expect(mockPresenter.presentSuccess).not.toHaveBeenCalled()
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentError).toHaveBeenCalledWith(repositoryError)
  })
})
