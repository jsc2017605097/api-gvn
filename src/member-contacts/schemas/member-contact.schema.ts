import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MemberContactDocument = MemberContact & Document;

@Schema({ collection: 'member_contacts', timestamps: false })
export class MemberContact {
  @Prop({ required: true })
  contact_no: string;

  @Prop()
  _created_at: Date;

  @Prop()
  _updated_at: Date;

  @Prop()
  account_no: string;

  @Prop()
  club_code: string;

  @Prop()
  filter_created_date: string;

  @Prop({ default: false })
  main_contact: boolean;

  @Prop()
  mobile_phone_no: string;

  @Prop()
  name: string;

  @Prop()
  phone_no: string;

  @Prop()
  scheme_code: string;

  @Prop({ default: false })
  send_receipt_by_email: boolean;
}

export const MemberContactSchema = SchemaFactory.createForClass(MemberContact);

