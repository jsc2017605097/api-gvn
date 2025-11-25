import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SaleOrderOfflineDetail, SaleOrderOfflineDetailDocument } from './schemas/sale-order-offline-detail.schema';

interface SaleOrderOfflineDetailResponse {
  _id: string;
  entry_no: string;
  _created_at: Date;
  _scraped_at: string;
  _source: string;
  _updated_at: Date;
  date: string;
  discount_amount: string;
  document_no: string;
  gross_amount: string;
  item_no: string;
  itemdescription: string;
  member_account_no: string;
  member_contact: string;
  member_contact_no: string;
  member_scheme: string;
  points: string;
  pos_terminal_no: string;
  quantity: string;
  store_no: string;
  transaction_no: string;
}

interface ApiResponseFormat {
  message: string;
  error: boolean;
  data: SaleOrderOfflineDetailResponse[];
}

@Injectable()
export class SaleOrderOfflineDetailsService {
  private readonly logger = new Logger(SaleOrderOfflineDetailsService.name);

  constructor(
    @InjectModel(SaleOrderOfflineDetail.name)
    private saleOrderOfflineDetailModel: Model<SaleOrderOfflineDetailDocument>,
  ) {}

  async findAllByMemberContact(memberContact: string): Promise<ApiResponseFormat> {
    const query = { member_contact: memberContact };
    const collectionName = this.saleOrderOfflineDetailModel.collection.name;

    this.logger.log('========================================');
    this.logger.log('🔍 [DEBUG] Query tìm sale order offline details');
    this.logger.log('========================================');
    this.logger.log(`📋 Collection name: ${collectionName}`);
    this.logger.log(`🔑 Query filter: ${JSON.stringify(query, null, 2)}`);
    this.logger.log(`🔎 Member Contact: ${memberContact}`);
    this.logger.log('========================================');

    // Query database
    let details = await this.saleOrderOfflineDetailModel
      .find(query)
      .lean()
      .exec();

    // Log kết quả
    if (details && details.length > 0) {
      this.logger.log(`✅ [DEBUG] Tìm thấy ${details.length} records`);
    } else {
      this.logger.warn('⚠️ [DEBUG] Không tìm thấy dữ liệu trong database');
      this.logger.warn(`🔍 Query đã thực thi: ${JSON.stringify(query, null, 2)}`);
      this.logger.warn(`📋 Collection: ${collectionName}`);
      this.logger.warn(`🔎 Tìm kiếm với: "${memberContact}"`);
      this.logger.warn('🔄 Bắt đầu fallback: Gọi API scrape...');

      // Fallback: Gọi API scrape
      try {
        await this.callScrapeApi(memberContact);

        // Đợi một chút để dữ liệu được lưu vào database
        this.logger.log('⏳ Đợi dữ liệu được lưu vào database...');
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Query lại database sau khi scrape
        this.logger.log('🔍 Query lại database sau khi scrape...');
        details = await this.saleOrderOfflineDetailModel
          .find(query)
          .lean()
          .exec();

        if (details && details.length > 0) {
          this.logger.log(`✅ Tìm thấy ${details.length} records sau khi scrape`);
        } else {
          this.logger.warn('⚠️ Vẫn không tìm thấy dữ liệu sau khi scrape');
        }
      } catch (error) {
        this.logger.error(`❌ Lỗi khi gọi API scrape: ${error.message}`);
        // Không throw error, trả về mảng rỗng
        details = [];
      }
    }
    this.logger.log('========================================');

    // Transform data
    const result: SaleOrderOfflineDetailResponse[] = (details || []).map((item: any) => ({
      _id: item._id.toString(),
      entry_no: item.entry_no || '',
      _created_at: item._created_at,
      _scraped_at: item._scraped_at || '',
      _source: item._source || '',
      _updated_at: item._updated_at,
      date: item.date || '',
      discount_amount: item.discount_amount || '',
      document_no: item.document_no || '',
      gross_amount: item.gross_amount || '',
      item_no: item.item_no || '',
      itemdescription: item.itemdescription || '',
      member_account_no: item.member_account_no || '',
      member_contact: item.member_contact || '',
      member_contact_no: item.member_contact_no || '',
      member_scheme: item.member_scheme || '',
      points: item.points || '',
      pos_terminal_no: item.pos_terminal_no || '',
      quantity: item.quantity || '',
      store_no: item.store_no || '',
      transaction_no: item.transaction_no || '',
    }));

    return {
      message: 'Lấy danh sách sale order offline detail thành công',
      error: false,
      data: result,
    };
  }

  private async callScrapeApi(memberContact: string): Promise<void> {
    const scrapeUrl = 'http://14.225.0.186:5000/api/scrape/sale-order-offline-detail';
    const requestBody = {
      member_contact: memberContact,
    };

    this.logger.log('========================================');
    this.logger.log('🔄 [SCRAPE] Gọi API scrape sale order offline detail');
    this.logger.log('========================================');
    this.logger.log(`🌐 URL: ${scrapeUrl}`);
    this.logger.log(`📦 Request Body: ${JSON.stringify(requestBody, null, 2)}`);
    this.logger.log('========================================');

    try {
      const response = await fetch(scrapeUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        this.logger.error(`❌ [SCRAPE] API trả về lỗi: ${response.status} ${response.statusText}`);
        this.logger.error(`📄 Response: ${errorText}`);
        throw new Error(`Scrape API failed: ${response.status} ${response.statusText}`);
      }

      const responseData = await response.json();
      this.logger.log('✅ [SCRAPE] API scrape thành công');
      this.logger.log(`📄 Response: ${JSON.stringify(responseData, null, 2)}`);
      this.logger.log('========================================');
    } catch (error) {
      this.logger.error('❌ [SCRAPE] Lỗi khi gọi API scrape');
      this.logger.error(`📄 Error: ${error.message}`);
      this.logger.error(`📄 Stack: ${error.stack}`);
      this.logger.log('========================================');
      throw error;
    }
  }
}


