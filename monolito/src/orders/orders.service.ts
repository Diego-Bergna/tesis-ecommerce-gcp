import { Injectable, Logger,BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Crea un nuevo pedido utilizando una transacción de base de datos para asegurar
   * la integridad del inventario (resta el stock y crea el ticket simultáneamente).
   * @function createOrder
   * @param {Object} data - Datos necesarios para crear el pedido.
   * @param {number} data.userId - ID del usuario que realiza la compra.
   * @param {Array<Object>} data.items - Arreglo de productos a comprar.
   * @param {number} data.items.productId - ID del producto.
   * @param {number} data.items.quantity - Cantidad a comprar de ese producto.
   * @returns {Promise<Object>} Promesa que retorna el objeto del pedido creado con sus items.
   * @throws {BadRequestException} Si un producto no existe o no hay stock suficiente.
   */
  async createOrder(data: { userId: number; items: { productId: number; quantity: number }[] }) {
    try {
      // Iniciamos una Transacción Interactiva de Prisma
      return this.prisma.$transaction(async (tx) => {
        this.logger.log(`🛒Creando pedido para usuario ${data.userId}`);
        let total = 0;
        const orderItemsData = [];

        // 1. Recorremos cada producto que el cliente quiere comprar
        for (const item of data.items) {
          // Buscamos el producto actual dentro de la transacción
          const product = await tx.product.findUnique({
            where: { id: item.productId },
          });

          // Validamos que el producto exista
          if (!product) {
            throw new BadRequestException(`El producto con ID ${item.productId} no existe.`);
          }

          // Validamos que haya stock suficiente para el Cyber Wow
          if (product.stock < item.quantity) {
            this.logger.error(`❌Stock insuficiente para el producto: ${product.name}. Stock actual: ${product.stock}`);
            throw new BadRequestException(`Stock insuficiente para el producto: ${product.name}. Stock actual: ${product.stock}`);
          }

          // 2. Restamos el stock de la base de datos de forma atómica (decrement)
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: {
                decrement: item.quantity,
              },
            },
          });

          // Sumamos al total del pedido (Precio * Cantidad)
          total += product.price * item.quantity;

          // Preparamos la data del detalle del pedido guardando el precio histórico
          orderItemsData.push({
            productId: item.productId,
            quantity: item.quantity,
            price: product.price,
          });
        }

        // 3. Creamos el ticket final (Order) junto con sus detalles (OrderItems)
        const order = await tx.order.create({
          data: {
            userId: data.userId,
            total,
            status: 'COMPLETED', // Simulamos que el pago ya fue aprobado
            items: {
              create: orderItemsData, // Prisma crea los OrderItems aquí
            },
          },
          include: {
            items: true, // Le decimos que nos devuelva el pedido con sus items incluidos
          },
          });

        this.logger.log(`🛒Pedido creado con éxito para usuario ${data.userId}`);
        return order; // Si todo salió bien, la transacción se ejecuta automáticamente
      });
    } catch (error) {
      this.logger.error(`❌Error al crear el pedido: ${error}`);
      throw error;
    }
  }

  /**
   * Obtiene el historial completo de pedidos registrados en el sistema,
   * incluyendo los detalles de cada pedido y la información del producto.
   * @function getOrders
   * @returns {Promise<Array<Object>>} Promesa que retorna un arreglo de pedidos.
   */
  async getOrders() {
    return this.prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true, // Traemos la info del producto para saber qué compró
          },
        },
      },
    });
  }
}