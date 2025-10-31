import { Module } from '@nestjs/common';
import { SeedCardService } from './seed-card.service';
import { SeedCardController } from './seed-card.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SeedCardController],
  providers: [SeedCardService],
  exports: [SeedCardService],
})
export class SeedCardModule {}

