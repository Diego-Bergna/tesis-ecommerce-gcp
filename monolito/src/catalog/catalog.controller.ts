import { Body, Controller, Get, Post } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('catalog')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  /**
   * Expone el endpoint POST para la creación de un producto.
   * @function createProduct
   * @param {Object} body - El cuerpo de la petición HTTP (Request Body).
   * @param {string} body.name - Nombre del producto.
   * @param {string} [body.description] - Descripción del producto.
   * @param {number} body.price - Precio del producto.
   * @param {number} body.stock - Stock inicial.
   * @returns {Promise<Object>} El producto creado con su ID generado.
   */
  @Post('products')
  createProduct(@Body() body: { name: string; description?: string; price: number; stock: number }) {
    return this.catalogService.createProduct(body);
  }

  /**
   * Expone el endpoint GET para listar todos los productos del catálogo.
   * @function getProducts
   * @returns {Promise<Array<Object>>} Lista de todos los productos en la base de datos.
   */
  @Get('products')
  getProducts() {
    return this.catalogService.getAllProducts();
  }
}