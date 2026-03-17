import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * Servicio que extiende el cliente de Prisma para manejar la conexión a la base de datos.
 * @class PrismaService
 * @extends {PrismaClient}
 * @implements {OnModuleInit}
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  
  /**
   * Método del ciclo de vida de NestJS que se ejecuta automáticamente 
   * cuando el módulo ha sido inicializado. Se encarga de abrir la 
   * conexión con la base de datos PostgreSQL.
   * @function onModuleInit
   * @returns {Promise<void>} Promesa que se resuelve cuando la conexión es exitosa.
   */
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Conexión a la base de datos establecida con éxito');
  }
}