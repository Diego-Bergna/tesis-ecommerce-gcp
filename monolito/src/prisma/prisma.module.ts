import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * Módulo global que provee y exporta el servicio de Prisma.
 * Al estar decorado con @Global(), los demás módulos de la aplicación 
 * no necesitan importarlo explícitamente para usar PrismaService.
 * @class PrismaModule
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}