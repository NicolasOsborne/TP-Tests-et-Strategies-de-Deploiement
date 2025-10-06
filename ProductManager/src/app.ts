import { InMemoryProductRepository } from './infrastructure/adapters/InMemoryProductRepository.js'
import type { ProductRepository } from './domain/ports/ProductRepository.js'
import type { ProductOutputPort } from './domain/ports/ProductOutputPort.js'
import type { ProductData } from './domain/entities/Product.js'

import { CreateProductUseCase } from './application/usecases/CreateProductUseCase.js'
import { GetProductByIdUseCase } from './application/usecases/GetProductByIdUseCase.js'
import { UpdateProductUseCase } from './application/usecases/UpdateProductUseCase.js'
import { DeleteProductUseCase } from './application/usecases/DeleteProductUseCase.js'
import { GetAllProductsUseCase } from './application/usecases/GetAllProductsUseCase.js'

import type { CreateProductInput } from './application/usecases/CreateProductUseCase.js'
import type { UpdateProductInput } from './application/usecases/UpdateProductUseCase.js'

class ConsoleProductPresenter implements ProductOutputPort {
  presentProduct(productData: ProductData): void {
    console.log('✅ SUCCESS: Product details presented.')
    console.log(productData)
  }
  presentProductList(productDataList: ProductData[]): void {
    console.log('✅ SUCCESS: Product list presented.')
    console.log(
      productDataList.map((p) => ({ id: p.id, name: p.name, price: p.price }))
    )
  }
  presentSuccess(message: string): void {
    console.log(`✅ SUCCESS: ${message}`)
  }
  presentError(error: Error): void {
    console.error(`❌ ERROR: ${error.message}`)
  }
}

const productRepository: ProductRepository = new InMemoryProductRepository()
const productPresenter: ProductOutputPort = new ConsoleProductPresenter()

const createProductUseCase = new CreateProductUseCase(
  productRepository,
  productPresenter
)
const getProductByIdUseCase = new GetProductByIdUseCase(
  productRepository,
  productPresenter
)
const updateProductUseCase = new UpdateProductUseCase(
  productRepository,
  productPresenter
)
const deleteProductUseCase = new DeleteProductUseCase(
  productRepository,
  productPresenter
)
const getAllProductsUseCase = new GetAllProductsUseCase(
  productRepository,
  productPresenter
)

// --- DÉMONSTRATION DU FLUX APPLICATIF ---

async function runDemo() {
  console.log('--- DÉMO CLEAN ARCHITECTURE : CATALOGUE DE PRODUITS ---')
  console.log('----------------------------------------------------')

  // [A] CRÉATION (Laptop)
  console.log('\n[A] Exécution: CreateProductUseCase (Laptop)')
  const laptopInput: CreateProductInput = {
    // CreateProductInput est un type
    name: 'Laptop Pro',
    description: 'Un ordinateur portable puissant pour professionnels.',
    price: 1200.5,
    stock: 15,
  }
  await createProductUseCase.execute(laptopInput)

  // [B] CRÉATION (Mouse)
  console.log('\n[B] Exécution: CreateProductUseCase (Mouse)')
  const mouseInput: CreateProductInput = {
    // CreateProductInput est un type
    name: 'Souris Ergonomique',
    description: 'Souris sans fil avec haute précision.',
    price: 35.99,
    stock: 100,
  }
  await createProductUseCase.execute(mouseInput)

  const allProductsBeforeUpdate = await productRepository.findAll()
  const laptopProduct = allProductsBeforeUpdate.find(
    (p) => p.name === 'Laptop Pro'
  )
  const laptopId = laptopProduct?.id

  // [C] LECTURE PAR ID (Laptop)
  if (laptopId) {
    console.log(`\n[C] Exécution: GetProductByIdUseCase (ID: ${laptopId})`)
    await getProductByIdUseCase.execute(laptopId)
  }

  // [D] MISE À JOUR (Laptop)
  if (laptopId) {
    console.log(
      `\n[D] Exécution: UpdateProductUseCase (ID: ${laptopId}, Nouveau Prix)`
    )
    const updateInput: UpdateProductInput = {
      id: laptopId,
      price: 1150.0,
      stock: 10,
    }
    await updateProductUseCase.execute(updateInput)
  }

  // [E] LECTURE DE TOUS
  console.log('\n[E] Exécution: GetAllProductsUseCase')
  await getAllProductsUseCase.execute()

  // [F] SUPPRESSION (Mouse)
  const mouseProduct = allProductsBeforeUpdate.find(
    (p) => p.name === 'Souris Ergonomique'
  )
  const mouseId = mouseProduct?.id
  if (mouseId) {
    console.log(`\n[F] Exécution: DeleteProductUseCase (ID: ${mouseId})`)
    await deleteProductUseCase.execute(mouseId)
  }

  // [G] VÉRIFICATION APRÈS SUPPRESSION
  console.log('\n[G] Exécution: GetAllProductsUseCase (Vérification)')
  await getAllProductsUseCase.execute()

  // [H] Test d'erreur: Tentative de création avec Price <= 0 (Règles métier de l'Entité)
  console.log("\n[H] Test d'erreur: Tentative de création avec Price <= 0")
  const badInput: CreateProductInput = {
    name: 'Article Nul',
    description: 'Produit sans valeur',
    price: 0,
    stock: 5,
  }
  await createProductUseCase.execute(badInput)

  // [I] Test d'erreur: Tentative de suppression d'un ID inexistant
  console.log(
    "\n[I] Test d'erreur: Tentative de suppression d'un ID inexistant"
  )
  await deleteProductUseCase.execute('unknown-product-id-123')
}

runDemo()
