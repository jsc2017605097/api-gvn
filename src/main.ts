import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const port = process.env.PORT ?? 3000;
  const mongoUri = 'mongodb://14.225.0.186:29125/giovanni?directConnection=true';

  logger.log('========================================');
  logger.log('🚀 Đang khởi động ứng dụng...');
  logger.log('========================================');
  logger.log(`📅 Thời gian: ${new Date().toLocaleString('vi-VN')}`);
  logger.log(`🌐 Port: ${port}`);
  logger.log(`🔌 MongoDB URI: ${mongoUri}`);
  logger.log(`📊 Database: giovanni`);
  logger.log(`🖥️  Host: 14.225.0.186:29125`);
  logger.log('========================================');

  try {
    logger.log('⏳ Đang tạo NestJS application...');
    const app = await NestFactory.create(AppModule, {
      logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });

    logger.log('✅ NestJS application đã được tạo thành công');
    logger.log('⏳ Đang kết nối tới MongoDB...');
    logger.log('📡 MongoDB connection events sẽ được log tự động...');

    // Đợi một chút để MongoDB connection được thiết lập
    await new Promise((resolve) => setTimeout(resolve, 1500));

    logger.log('✅ Đang khởi động server...');
    await app.listen(port);

    logger.log('========================================');
    logger.log('✅ Ứng dụng đã khởi động thành công!');
    logger.log(`🌐 Server đang chạy tại: http://localhost:${port}`);
    logger.log(`🔌 MongoDB: Đã kết nối tới giovanni`);
    logger.log('========================================');
  } catch (error) {
    logger.error('❌ Lỗi khi khởi động ứng dụng:', error);
    process.exit(1);
  }
}
bootstrap();
