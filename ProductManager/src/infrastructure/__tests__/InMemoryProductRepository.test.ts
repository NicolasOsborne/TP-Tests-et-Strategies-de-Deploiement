import { v4 as uuidv4 } from 'uuid'
import { InMemoryProductRepository } from '../adapters/InMemoryProductRepository.js'
import { jest } from '@jest/globals'

class Product {
  constructor(public id: string, public name: string, public price: number) {}
}

describe("InMemoryProductRepository (Tests d'Intégration)", () => {
  let repository: InMemoryProductRepository

  // Créer une nouvelle instance de repository avant chaque test pour garantir un état propre
  beforeEach(() => {
    repository = new InMemoryProductRepository()
  })

  // Données de base
  const productData1 = { id: uuidv4(), name: 'T-shirt Coton', price: 25.0 }
  const productData2 = { id: uuidv4(), name: 'Jeans Slim', price: 75.0 }
  const nonExistentId = uuidv4()

  // --- Tests CRUD fondamentaux ---

  test('devrait créer un produit et le récupérer (save / findById)', async () => {
    // GIVEN: Un nouveau produit
    const newProduct = new Product(
      productData1.id,
      productData1.name,
      productData1.price
    )

    // WHEN: Le produit est sauvegardé (CREATE)
    const savedProduct = await repository.save(newProduct)

    // THEN: On peut le récupérer (READ)
    const foundProduct = await repository.findById(productData1.id)

    expect(savedProduct).toEqual(newProduct)
    expect(foundProduct).toEqual(newProduct)
  })

  test('devrait récupérer tous les produits (findAll)', async () => {
    // GIVEN: Deux produits sauvegardés
    const product1 = new Product(
      productData1.id,
      productData1.name,
      productData1.price
    )
    const product2 = new Product(
      productData2.id,
      productData2.name,
      productData2.price
    )

    await repository.save(product1)
    await repository.save(product2)

    // WHEN: On récupère tous les produits
    const allProducts = await repository.findAll()

    // THEN: Le tableau doit contenir les deux produits
    expect(allProducts).toHaveLength(2)
    expect(allProducts).toEqual(expect.arrayContaining([product1, product2]))
  })

  test('devrait mettre à jour un produit existant (update)', async () => {
    // GIVEN: Un produit existant
    const originalProduct = new Product(
      productData1.id,
      productData1.name,
      productData1.price
    )
    await repository.save(originalProduct)

    // WHEN: On crée une version mise à jour
    const updatedName = 'T-shirt Coton Bio'
    const updatedPrice = 35.0
    const updatedProduct = new Product(
      productData1.id,
      updatedName,
      updatedPrice
    )

    await repository.update(updatedProduct)

    // THEN: Les modifications sont persistées
    const retrievedProduct = await repository.findById(productData1.id)

    expect(retrievedProduct).not.toBeNull()
    expect(retrievedProduct!.name).toBe(updatedName)
    expect(retrievedProduct!.price).toBe(updatedPrice)
  })

  test('devrait utiliser save pour mettre à jour si le produit existe déjà', async () => {
    // GIVEN: Un produit existant
    const originalProduct = new Product(
      productData1.id,
      productData1.name,
      productData1.price
    )
    await repository.save(originalProduct)

    // WHEN: On appelle save avec une nouvelle version (qui déclenche update interne)
    const updatedProduct = new Product(productData1.id, 'Nouveau Nom', 99.99)
    await repository.save(updatedProduct)

    // THEN: Le produit est bien mis à jour
    const retrievedProduct = await repository.findById(productData1.id)
    expect(retrievedProduct!.name).toBe('Nouveau Nom')
    expect(retrievedProduct!.price).toBe(99.99)
  })

  test('devrait supprimer un produit et le rendre irrécupérable (delete)', async () => {
    // GIVEN: Un produit existant
    const productToDelete = new Product(
      productData1.id,
      productData1.name,
      productData1.price
    )
    await repository.save(productToDelete)

    // WHEN: Le produit est supprimé
    await repository.delete(productData1.id)

    // THEN: Il n'est plus trouvable
    const foundProduct = await repository.findById(productData1.id)
    expect(foundProduct).toBeNull()
  })

  // --- Tests de Cas Limites / Gestion d'Erreurs ---

  test("devrait retourner null lors de la recherche d'un ID inexistant (findById)", async () => {
    // WHEN: On cherche un ID qui n'existe pas
    const foundProduct = await repository.findById(nonExistentId)

    // THEN: Le résultat doit être null
    expect(foundProduct).toBeNull()
  })

  test("devrait lever une erreur lors de la mise à jour d'un ID inexistant (update)", async () => {
    // GIVEN: Un produit à mettre à jour qui n'a jamais été persisté
    const nonExistentProduct = new Product(nonExistentId, 'Faux Produit', 10.0)

    // THEN: L'appel à update doit rejeter (throw) l'erreur
    await expect(repository.update(nonExistentProduct)).rejects.toThrow(
      `Product with id ${nonExistentId} not found.`
    )
  })

  test("devrait lever une erreur lors de la suppression d'un ID inexistant (delete)", async () => {
    // THEN: L'appel à delete doit rejeter (throw) l'erreur
    await expect(repository.delete(nonExistentId)).rejects.toThrow(
      `Product with id ${nonExistentId} not found for deletion.`
    )
  })
})
