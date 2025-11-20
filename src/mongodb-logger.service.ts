import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class MongodbLoggerService implements OnModuleInit {
  private readonly logger = new Logger('MongoDB');

  constructor(@InjectConnection() private connection: Connection) {}

  onModuleInit() {
    this.logger.log('🔌 Đang thiết lập MongoDB connection event listeners...');

    this.connection.on('connected', () => {
      this.logger.log('✅ MongoDB đã kết nối thành công!');
      this.logger.log(`📊 Database: ${this.connection.db?.databaseName}`);
      this.logger.log(`🖥️  Host: ${this.connection.host}:${this.connection.port}`);
    });

    this.connection.on('error', (error) => {
      this.logger.error('❌ Lỗi kết nối MongoDB:', error);
    });

    this.connection.on('disconnected', () => {
      this.logger.warn('⚠️  MongoDB đã ngắt kết nối');
    });

    this.connection.on('reconnected', () => {
      this.logger.log('🔄 MongoDB đã kết nối lại');
    });

    // Log trạng thái hiện tại
    if (this.connection.readyState === 1) {
      this.logger.log('✅ MongoDB đã sẵn sàng (readyState: connected)');
    } else if (this.connection.readyState === 0) {
      this.logger.log('⏳ MongoDB đang kết nối (readyState: disconnected)');
    } else if (this.connection.readyState === 2) {
      this.logger.log('⏳ MongoDB đang kết nối (readyState: connecting)');
    } else if (this.connection.readyState === 3) {
      this.logger.warn('⚠️  MongoDB đang ngắt kết nối (readyState: disconnecting)');
    }
  }
}

