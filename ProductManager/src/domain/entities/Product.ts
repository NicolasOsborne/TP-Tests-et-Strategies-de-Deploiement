import { v4 as uuidv4 } from 'uuid'

export class Product {
  public readonly id: string
  private _name!: string
  private _description!: string
  private _price!: number
  private _stock!: number

  constructor(
    name: string,
    description: string,
    price: number,
    stock: number,
    id?: string
  ) {
    this.id = id || uuidv4()
    this.updateName(name)
    this.updateDescription(description)
    this.changePrice(price)
    this.adjustStock(stock)
  }

  get name(): string {
    return this._name
  }
  get description(): string {
    return this._description
  }
  get price(): number {
    return this._price
  }
  get stock(): number {
    return this._stock
  }

  public updateName(newName: string): void {
    if (!newName || newName.trim() === '') {
      throw new Error('Product name cannot be empty.')
    }
    this._name = newName.trim()
  }

  public updateDescription(newDescription: string): void {
    this._description = newDescription || ''
  }

  public changePrice(newPrice: number): void {
    if (typeof newPrice !== 'number' || newPrice <= 0) {
      throw new Error('Price must be strictly positive.')
    }
    this._price = newPrice
  }

  public adjustStock(quantity: number): void {
    if (typeof quantity !== 'number' || quantity < 0) {
      throw new Error('Stock must be greater than or equal to zero.')
    }
    this._stock = quantity
  }
}

export interface ProductData {
  id: string
  name: string
  description: string
  price: number
  stock: number
}

export const toProductData = (product: Product): ProductData => ({
  id: product.id,
  name: product.name,
  description: product.description,
  price: product.price,
  stock: product.stock,
})
