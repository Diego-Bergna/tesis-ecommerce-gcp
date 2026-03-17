import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CatalogModule } from './catalog/catalog.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [UsersModule, CatalogModule, OrdersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
