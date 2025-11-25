import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { SaleOrderOfflineDetailsService } from './sale-order-offline-details.service';

interface ApiResponseFormat {
  message: string;
  error: boolean;
  data: any[];
}

@Controller('sale-order-offline-details')
export class SaleOrderOfflineDetailsController {
  constructor(private readonly saleOrderOfflineDetailsService: SaleOrderOfflineDetailsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query('member_contact') memberContact: string,
  ): Promise<ApiResponseFormat> {
    if (!memberContact) {
      return {
        message: 'Tham số member_contact là bắt buộc',
        error: true,
        data: [],
      };
    }

    return await this.saleOrderOfflineDetailsService.findAllByMemberContact(memberContact);
  }
}


