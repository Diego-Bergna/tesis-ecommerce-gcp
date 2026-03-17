import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo producto en la base de datos.
   * @function createProduct
   * @param {Object} data - Contiene los datos requeridos para registrar un producto.
   * @param {string} data.name - Nombre comercial del producto.
   * @param {string} [data.description] - (Opcional) Descripción detallada del producto.
   * @param {number} data.price - Precio unitario del producto.
   * @param {number} data.stock - Cantidad disponible inicial en el inventario.
   * @returns {Promise<Object>} Promesa que retorna el objeto del producto recién creado.
   */
  async createProduct(data: { name: string; description?: string; price: number; stock: number }) {
    return this.prisma.product.create({
      data,
    });
  }

  /**
   * Obtiene la lista completa de productos registrados en el sistema.
   * @function getAllProducts
   * @returns {Promise<Array<Object>>} Promesa que retorna un arreglo de objetos de productos.
   */
  async getAllProducts() {
    return this.prisma.product.findMany();
  }
}