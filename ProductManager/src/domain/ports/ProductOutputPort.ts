import type { ProductData } from '../entities/Product.js'

export interface ProductOutputPort {
  presentProduct(productData: ProductData): void
  presentProductList(productDataList: ProductData[]): void
  presentSuccess(message: string): void

  presentError(error: Error): void
}
