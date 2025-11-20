import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MemberContactsController } from './member-contacts.controller';
import { MemberContactsService } from './member-contacts.service';
import { MemberContact, MemberContactSchema } from './schemas/member-contact.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MemberContact.name, schema: MemberContactSchema },
    ]),
  ],
  controllers: [MemberContactsController],
  providers: [MemberContactsService],
  exports: [MemberContactsService],
})
export class MemberContactsModule {}

