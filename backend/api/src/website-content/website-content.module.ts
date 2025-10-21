import { Module } from '@nestjs/common';
import { WebsiteContentService } from './website-content.service';
import { WebsiteContentController } from './website-content.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [WebsiteContentController],
  providers: [WebsiteContentService],
  exports: [WebsiteContentService],
})
export class WebsiteContentModule {}

