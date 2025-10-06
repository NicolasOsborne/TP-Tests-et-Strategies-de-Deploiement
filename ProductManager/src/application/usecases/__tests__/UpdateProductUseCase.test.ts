import { UpdateProductUseCase } from '../UpdateProductUseCase.js'
import type { UpdateProductInput } from '../UpdateProductUseCase.js'
import type { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../../domain/ports/ProductOutputPort.js'
import { Product, toProductData } from '../../../domain/entities/Product.js'
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

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase
  const productId = 'prod-id-123'
  const initialProduct = new Product('Old Name', 'Old Desc', 100, 10, productId)
  const updateInput: UpdateProductInput = {
    id: productId,
    name: 'New Name',
    price: 150.0,
  }

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new UpdateProductUseCase(mockRepository, mockPresenter)

    // findById doit retourner une NOUVELLE instance pour que les modifications ne se propagent pas
    // entre les tests (bien que clearAllMocks aide, c'est plus sûr).
    mockRepository.findById.mockResolvedValue(
      new Product(
        initialProduct.name,
        initialProduct.description,
        initialProduct.price,
        initialProduct.stock,
        initialProduct.id
      )
    )
  })

  // --- Scénarios Nominaux ---

  it('should successfully update product attributes and present the result', async () => {
    const updatedProduct = new Product(
      'New Name',
      'Old Desc',
      150.0,
      10,
      productId
    )
    mockRepository.update.mockResolvedValue(updatedProduct)

    await useCase.execute(updateInput)

    // 1. Vérifie l'appel du Repository pour la recherche
    expect(mockRepository.findById).toHaveBeenCalledWith(productId)

    // 2. Vérifie l'appel du Repository pour la mise à jour
    expect(mockRepository.update).toHaveBeenCalledTimes(1)
    const calledProduct = mockRepository.update.mock.calls[0][0]!
    expect(calledProduct.name).toBe(updateInput.name)
    expect(calledProduct.price).toBe(updateInput.price)

    // 3. Vérifie l'appel du Presenter
    expect(mockPresenter.presentProduct).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentProduct).toHaveBeenCalledWith(
      toProductData(updatedProduct)
    )
    expect(mockPresenter.presentError).not.toHaveBeenCalled()
  })

  // --- Scénarios d'Erreur ---

  it('should present an error if the product to update is not found', async () => {
    mockRepository.findById.mockResolvedValue(null) // Simule produit non trouvé

    await useCase.execute(updateInput)

    expect(mockRepository.update).not.toHaveBeenCalled()
    expect(mockPresenter.presentProduct).not.toHaveBeenCalled()
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentError).toHaveBeenCalledWith(
      new Error(`Product with ID ${productId} not found for update.`)
    )
  })

  it('should present an error if the update violates entity rules (e.g., invalid price)', async () => {
    const invalidUpdateInput: UpdateProductInput = { id: productId, price: -5 }

    await useCase.execute(invalidUpdateInput)

    expect(mockRepository.update).not.toHaveBeenCalled() // Ne devrait pas atteindre l'adaptateur
    expect(mockPresenter.presentProduct).not.toHaveBeenCalled()
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1)
    const error = mockPresenter.presentError.mock.calls[0][0]!
    expect(error.message).toBe('Price must be strictly positive.')
  })
})
