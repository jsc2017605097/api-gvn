import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SaleOrderOfflineDetailsController } from './sale-order-offline-details.controller';
import { SaleOrderOfflineDetailsService } from './sale-order-offline-details.service';
import { SaleOrderOfflineDetail, SaleOrderOfflineDetailSchema } from './schemas/sale-order-offline-detail.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: SaleOrderOfflineDetail.name, schema: SaleOrderOfflineDetailSchema },
    ]),
  ],
  controllers: [SaleOrderOfflineDetailsController],
  providers: [SaleOrderOfflineDetailsService],
  exports: [SaleOrderOfflineDetailsService],
})
export class SaleOrderOfflineDetailsModule {}


