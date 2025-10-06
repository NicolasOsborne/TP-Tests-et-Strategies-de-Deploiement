import { CreateProductUseCase } from '../CreateProductUseCase.js'
import type { CreateProductInput } from '../CreateProductUseCase.js'
import type { ProductRepository } from '../../../domain/ports/ProductRepository.js'
import type { ProductOutputPort } from '../../../domain/ports/ProductOutputPort.js'
import { Product, toProductData } from '../../../domain/entities/Product.js'
import { jest } from '@jest/globals'

// Création des mocks pour les dépendances
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

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase
  const validProductInput: CreateProductInput = {
    name: 'New Gadget',
    description: 'A great new gadget.',
    price: 99.99,
    stock: 50,
  }

  beforeEach(() => {
    // Réinitialiser les mocks avant chaque test
    jest.clearAllMocks()
    useCase = new CreateProductUseCase(mockRepository, mockPresenter)
  })

  it('should successfully create and present a new product', async () => {
    // Simuler le produit qui serait retourné par le repository (avec l'ID)
    const savedProduct = new Product(
      validProductInput.name,
      validProductInput.description,
      validProductInput.price,
      validProductInput.stock
    )

    // Configurer le mock: save retourne le produit créé
    mockRepository.save.mockResolvedValue(savedProduct)

    await useCase.execute(validProductInput)

    // Vérification des interactions (Scénario Nominal)
    expect(mockRepository.save).toHaveBeenCalledTimes(1)

    // Vérifier que save est appelé avec un objet Product valide
    const calledProduct = mockRepository.save.mock.calls[0][0]
    expect(calledProduct.name).toBe(validProductInput.name)
    expect(calledProduct.price).toBe(validProductInput.price)

    // Vérifier que le présentateur est appelé avec les données
    expect(mockPresenter.presentProduct).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentProduct).toHaveBeenCalledWith(
      toProductData(savedProduct)
    )
    expect(mockPresenter.presentError).not.toHaveBeenCalled()
  })

  it('should present an error if the Product Entity validation fails (e.g., price is 0)', async () => {
    const invalidInput: CreateProductInput = { ...validProductInput, price: 0 }

    await useCase.execute(invalidInput)

    // Vérification des interactions (Scénario d'Erreur)
    expect(mockRepository.save).not.toHaveBeenCalled() // Le repo ne doit pas être appelé
    expect(mockPresenter.presentProduct).not.toHaveBeenCalled()
    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1)

    // Vérifier que l'erreur de règle métier est bien transmise au présentateur
    const error = mockPresenter.presentError.mock.calls[0][0]
    expect(error.message).toBe('Price must be strictly positive.')
  })

  it('should present an error if repository save fails', async () => {
    const repositoryError = new Error('Database connection failed.')
    mockRepository.save.mockRejectedValue(repositoryError)

    await useCase.execute(validProductInput)

    expect(mockPresenter.presentError).toHaveBeenCalledTimes(1)
    expect(mockPresenter.presentError).toHaveBeenCalledWith(repositoryError)
    expect(mockPresenter.presentProduct).not.toHaveBeenCalled()
  })
})
