import Product from '../models/Product.js';
import SkillUpUserService from './SkillUpUserService.js';

/**
 * Service responsável pela lógica de loja (produtos, compra, equipar itens).
 */
class SkillUpStoreService {
  /**
   * Lista todos os produtos disponíveis.
   * @returns {Promise<any[]>}
   */
  async listProducts() {
    const products = await Product.find().lean();
    return products;
  }

  /**
   * Permite que o usuário compre um produto, debitando moedas e
   * adicionando o item à lista de itens possuídos.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado.
   * @param {string} productId ID do produto.
   * @returns {Promise<any>} Documento UserSkillUp atualizado.
   */
  async buyProduct(user, productId) {
    if (!productId) {
      throw new Error('PRODUCT_ID_REQUIRED');
    }

    const userSkill = await SkillUpUserService.getOrCreateUserSkillUp(user);

    const product = await Product.findById(productId).lean();

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    const alreadyOwns = userSkill.itemsOwned.some(id => id.toString() === product._id.toString());
    if (alreadyOwns) {
      throw new Error('ALREADY_OWNS_PRODUCT');
    }

    if (userSkill.coins < product.price) {
      throw new Error('NOT_ENOUGH_COINS');
    }

    userSkill.coins -= product.price;
    userSkill.itemsOwned.push(product._id);
    await userSkill.save();

    return userSkill;
  }

  /**
   * Equipa um item previamente comprado pelo usuário.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado.
   * @param {string} itemId ID do produto a equipar.
   * @returns {Promise<any>} Documento UserSkillUp atualizado.
   */
  async equipItem(user, itemId) {
    if (!itemId) {
      throw new Error('ITEM_ID_REQUIRED');
    }

    const userSkill = await SkillUpUserService.getOrCreateUserSkillUp(user);

    const product = await Product.findById(itemId).lean();

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    const ownsItem = userSkill.itemsOwned.some(id => id.toString() === product._id.toString());
    if (!ownsItem) {
      throw new Error('ITEM_NOT_OWNED');
    }

    const alreadyEquipped = userSkill.equippedItems.some(id => id.toString() === product._id.toString());
    if (alreadyEquipped) {
      throw new Error('ITEM_ALREADY_EQUIPPED');
    }

    userSkill.equippedItems.push(product._id);
    await userSkill.save();

    return userSkill;
  }

  /**
   * Desequipa um item atualmente equipado pelo usuário.
   *
   * @param {{ email: string, name?: string }} user Usuário autenticado.
   * @param {string} itemId ID do produto a desequipar.
   * @returns {Promise<any>} Documento UserSkillUp atualizado.
   */
  async unequipItem(user, itemId) {
    if (!itemId) {
      throw new Error('ITEM_ID_REQUIRED');
    }

    const userSkill = await SkillUpUserService.getOrCreateUserSkillUp(user);

    const product = await Product.findById(itemId).lean();

    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    const isEquippedIndex = userSkill.equippedItems.findIndex(id => id.toString() === product._id.toString());
    if (isEquippedIndex === -1) {
      throw new Error('ITEM_NOT_EQUIPPED');
    }

    userSkill.equippedItems.splice(isEquippedIndex, 1);
    await userSkill.save();

    return userSkill;
  }
}

export default new SkillUpStoreService();
