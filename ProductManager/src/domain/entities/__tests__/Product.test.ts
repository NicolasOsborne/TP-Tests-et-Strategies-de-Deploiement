import { Product } from '../Product.js'

describe('Product Entity', () => {
  const validProductArgs = ['Test Name', 'Test Description', 100.5, 10] as const

  it('should create a product with valid initial data', () => {
    const product = new Product(...validProductArgs)
    expect(product).toBeDefined()
    expect(product.name).toBe('Test Name')
    expect(product.price).toBe(100.5)
    expect(product.stock).toBe(10)
    expect(product.id).toBeDefined()
  })

  it('should allow updating the name', () => {
    const product = new Product(...validProductArgs)
    product.updateName('New Name')
    expect(product.name).toBe('New Name')
  })

  it('should allow changing the price', () => {
    const product = new Product(...validProductArgs)
    product.changePrice(250.99)
    expect(product.price).toBe(250.99)
  })

  it('should allow adjusting the stock', () => {
    const product = new Product(...validProductArgs)
    product.adjustStock(50)
    expect(product.stock).toBe(50)
  })

  it('should throw an error if created with a price less than or equal to zero', () => {
    // Création avec prix = 0
    expect(() => new Product('Test', 'Desc', 0, 10)).toThrow(
      'Price must be strictly positive.'
    )
    // Création avec prix négatif
    expect(() => new Product('Test', 'Desc', -5, 10)).toThrow(
      'Price must be strictly positive.'
    )
  })

  it('should throw an error if created with a stock less than zero', () => {
    expect(() => new Product('Test', 'Desc', 100, -1)).toThrow(
      'Stock must be greater than or equal to zero.'
    )
  })

  it('should throw an error when attempting to update with an empty name', () => {
    const product = new Product(...validProductArgs)
    expect(() => product.updateName('')).toThrow(
      'Product name cannot be empty.'
    )
    expect(() => product.updateName(' ')).toThrow(
      'Product name cannot be empty.'
    )
  })

  it('should throw an error when attempting to change to a non-positive price', () => {
    const product = new Product(...validProductArgs)
    expect(() => product.changePrice(0)).toThrow(
      'Price must be strictly positive.'
    )
    expect(() => product.changePrice(-10)).toThrow(
      'Price must be strictly positive.'
    )
  })

  it('should throw an error when attempting to set a negative stock', () => {
    const product = new Product(...validProductArgs)
    expect(() => product.adjustStock(-5)).toThrow(
      'Stock must be greater than or equal to zero.'
    )
  })
})
