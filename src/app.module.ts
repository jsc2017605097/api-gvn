import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongodbLoggerService } from './mongodb-logger.service';
import { MemberContactsModule } from './member-contacts/member-contacts.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://14.225.0.186:29125/giovanni?directConnection=true', {
      connectionFactory: (connection) => {
        const logger = new Logger('MongoDB');
        logger.log('🔧 Đang khởi tạo MongoDB connection...');
        return connection;
      },
    }),
    MemberContactsModule,
  ],
  controllers: [AppController],
  providers: [AppService, MongodbLoggerService],
})
export class AppModule {}
