import { GetAllProductsUseCase } from '../GetAllProductsUseCase.js'
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

describe('GetAllProductsUseCase', () => {
  let useCase: GetAllProductsUseCase

  const product1 = new Product('A', 'Desc A', 10, 5, 'id1')
  const product2 = new Product('B', 'Desc B', 20, 10, 'id2')
  const mockProductList = [product1, product2]

  beforeEach(() => {
    jest.clearAllMocks()
    useCase = new GetAllProductsUseCase(mockRepository, mockPresenter)
  })

  // --- Scénario Nominal ---

  it('should successfully retrieve all products and present the list', async () => {
    // Simuler le repository retournant une liste de produits
    mockRepository.findAll.mockResolvedValue(mockProductList)

    await useCase.execute()

    // Vérification des interactions
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1)

    expect(mockPresenter.presentProductList).toHaveBeenCalledTimes(1)

    // Vérifier que le présentateur est appelé avec les ProductData mappées
    const expectedDataList = mockProductList.map(toProductData)
    expect(mockPresenter.presentProductList).toHaveBeenCalledWith(
      expectedDataList
    )
    expect(mockPresenter.presentError).not.toHaveBeenCalled()
  })

  it('should successfully handle and present an empty list of products', async () => {
    // Simuler le repository retournant un tableau vide
    mockRepository.findAll.mockResolvedValue([])

    await useCase.execute()

    // Vérification des interactions
    expect(mockRepository.findAll).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentProductList).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentProductList).toHaveBeenCalledWith([])
    expect(mockPresenter.presentError).not.toHaveBeenCalled()
  })

  // --- Scénarios d'Erreur ---

  it('should present an error if the repository operation fails', async () => {
    const repositoryError = new Error('Connection refused by DB.')
    mockRepository.findAll.mockRejectedValue(repositoryError)

    await useCase.execute()

    expect(mockPresenter.presentProductList).not.toHaveBeenCalled()
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentError).toHaveBeenCalledWith(repositoryError)
  })
})
