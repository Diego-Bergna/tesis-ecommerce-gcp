import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Expone el endpoint POST para la creación de un nuevo pedido.
   * @function createOrder
   * @param {Object} body - El cuerpo de la petición HTTP (Request Body).
   * @param {number} body.userId - ID del usuario que realiza la compra.
   * @param {Array<Object>} body.items - Lista de productos y cantidades a comprar.
   * @param {number} body.items.productId - ID del producto a comprar.
   * @param {number} body.items.quantity - Cantidad deseada de dicho producto.
   * @returns {Promise<Object>} Promesa que retorna el ticket del pedido creado con sus detalles.
   */
  @Post()
  createOrder(@Body() body: { userId: number; items: { productId: number; quantity: number }[] }) {
    return this.ordersService.createOrder(body);
  }

  /**
   * Expone el endpoint GET para listar todo el historial de pedidos.
   * @function getOrders
   * @returns {Promise<Array<Object>>} Lista de pedidos con sus respectivos items y productos.
   */
  @Get()
  getOrders() {
    return this.ordersService.getOrders();
  }
}