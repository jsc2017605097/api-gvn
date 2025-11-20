import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

// General sub-schema
class GeneralSchema {
  @Prop()
  account_no: string;

  @Prop()
  contact_no: string;

  @Prop()
  main_contact: string;

  @Prop()
  name: string;

  @Prop()
  address: string;

  @Prop()
  address_2: string;

  @Prop()
  post_code: string;

  @Prop()
  city: string;

  @Prop()
  territory_code: string;

  @Prop()
  language_code: string;

  @Prop()
  phone_no: string;

  @Prop()
  mobile_phone_no: string;

  @Prop()
  e_mail: string;

  @Prop()
  gender: string;

  @Prop()
  contact_gender: string;

  @Prop()
  date_of_birth: string;

  @Prop()
  marital_status: string;

  @Prop()
  expiration_period_type: string;

  @Prop()
  '<blocked2>': string;

  @Prop()
  date_blocked: string;

  @Prop()
  reason_blocked: string;

  @Prop()
  blocked_by: string;

  @Prop()
  send_receipt_by_e_mail: string;

  @Prop()
  comments: string;
}

// Sales sub-schema
class SalesSchema {
  @Prop()
  total_sales: string;
}

// Points sub-schema
class PointsSchema {
  @Prop()
  issued_award_points: string;

  @Prop()
  issued_other_points: string;

  @Prop()
  total_issued_points: string;

  @Prop()
  expired_points: string;

  @Prop()
  used_points: string;

  @Prop()
  balance: string;

  @Prop()
  expirationperiod: string;

  @Prop()
  expiration_in_period: string;
}

// Member contact statistics sub-schema
class MemberContactStatisticsSchema {
  @Prop()
  created_date: string;

  @Prop()
  club_code: string;

  @Prop()
  scheme_code: string;

  @Prop()
  commentcount: string;

  @Prop({ type: Object })
  sales: SalesSchema;

  @Prop({ type: Object })
  points: PointsSchema;
}

// NWV VAT Info sub-schema
class NwvVatInfoSchema {
  @Prop()
  nwv_vat_is_send_sms: string;

  @Prop()
  nwv_vat_registration_no: string;

  @Prop()
  nwv_vat_buyer_name: string;

  @Prop()
  nwv_vat_company_name: string;

  @Prop()
  nwv_vat_address: string;

  @Prop()
  nwv_vat_bank_account: string;

  @Prop()
  nwv_vat_payment_method: string;

  @Prop()
  nwv_vat_phone_no: string;

  @Prop()
  nwv_vat_email: string;

  @Prop()
  nwv_vat_passport: string;

  @Prop()
  nwv_vat_nationality: string;
}

export type MemberContactDetailDocument = MemberContactDetail & Document;

@Schema({ collection: 'member-contact-detail', timestamps: false })
export class MemberContactDetail {
  @Prop({ required: true, unique: true })
  member_contact: string;

  @Prop()
  _created_at: Date;

  @Prop()
  _scraped_at: string;

  @Prop()
  _source: string;

  @Prop()
  _updated_at: Date;

  @Prop({ type: Object })
  general: GeneralSchema;

  @Prop({ type: Object })
  member_contact_statistics: MemberContactStatisticsSchema;

  @Prop({ type: Object })
  nwv_vat_info: NwvVatInfoSchema;
}

export const MemberContactDetailSchema = SchemaFactory.createForClass(MemberContactDetail);

