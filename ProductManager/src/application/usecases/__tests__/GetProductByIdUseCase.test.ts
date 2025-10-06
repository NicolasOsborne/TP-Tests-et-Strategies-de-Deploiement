import { GetProductByIdUseCase } from '../GetProductByIdUseCase.js'
import type { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../../domain/ports/ProductOutputPort.js'
import { Product, toProductData } from '../../../domain/entities/Product.js'
import { jest } from '@jest/globals'

// Mocks (réutilisez ceux du test précédent ou définissez-les ici si vous préférez l'isolation complète)
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

describe('GetProductByIdUseCase', () => {
  let useCase: GetProductByIdUseCase
  const productId = 'test-id-123'
  const mockProduct = new Product('Existing', 'A product', 50, 5, productId)

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new GetProductByIdUseCase(mockRepository, mockPresenter)
  })

  it('should successfully retrieve and present an existing product', async () => {
    // Scénario Nominal : findById retourne un produit
    mockRepository.findById.mockResolvedValue(mockProduct)

    await useCase.execute(productId)

    // Vérification des interactions
    expect(mockRepository.findById).toHaveBeenCalledWith(productId)
    expect(mockPresenter.presentProduct).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentProduct).toHaveBeenCalledWith(
      toProductData(mockProduct)
    )
    expect(mockPresenter.presentError).not.toHaveBeenCalled()
  })

  it('should present an error if the product is not found (findById returns null)', async () => {
    // Scénario d'Erreur : findById retourne null
    mockRepository.findById.mockResolvedValue(null)

    await useCase.execute(productId)

    // Vérification des interactions
    expect(mockRepository.findById).toHaveBeenCalledWith(productId)
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1)

    // Le Use Case est responsable de lever l'erreur si le produit est null
    expect(mockPresenter.presentError).toHaveBeenCalledWith(
      new Error(`Product with ID ${productId} not found.`)
    )
    expect(mockPresenter.presentProduct).not.toHaveBeenCalled()
  })

  it('should present an error if the repository operation fails', async () => {
    const repositoryError = new Error('Network timeout.')
    mockRepository.findById.mockRejectedValue(repositoryError)

    await useCase.execute(productId)

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentError).toHaveBeenCalledWith(repositoryError)
    expect(mockPresenter.presentProduct).not.toHaveBeenCalled()
  })
})
