import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SaleOrderOfflineDetailDocument = SaleOrderOfflineDetail & Document;

@Schema({ collection: 'sale-order-offline-detail', timestamps: false })
export class SaleOrderOfflineDetail {
  @Prop()
  entry_no: string;

  @Prop()
  _created_at: Date;

  @Prop()
  _scraped_at: string;

  @Prop()
  _source: string;

  @Prop()
  _updated_at: Date;

  @Prop()
  date: string;

  @Prop()
  discount_amount: string;

  @Prop()
  document_no: string;

  @Prop()
  gross_amount: string;

  @Prop()
  item_no: string;

  @Prop()
  itemdescription: string;

  @Prop()
  member_account_no: string;

  @Prop()
  member_contact: string;

  @Prop()
  member_contact_no: string;

  @Prop()
  member_scheme: string;

  @Prop()
  points: string;

  @Prop()
  pos_terminal_no: string;

  @Prop()
  quantity: string;

  @Prop()
  store_no: string;

  @Prop()
  transaction_no: string;
}

export const SaleOrderOfflineDetailSchema = SchemaFactory.createForClass(SaleOrderOfflineDetail);


