import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { SeedCardService } from './seed-card.service';
import { CreateSeedCardDto } from './dto/create-seed-card.dto';
import { UpdateSeedCardDto } from './dto/update-seed-card.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('seed-cards')
export class SeedCardController {
  constructor(private readonly seedCardService: SeedCardService) {}

  /**
   * Get all seed cards (public endpoint)
   * Query params: featured (boolean), active (boolean)
   */
  @Get()
  findAll(
    @Query('featured') featured?: string,
    @Query('active') active?: string,
  ) {
    const featuredBool = featured === 'true' ? true : featured === 'false' ? false : undefined;
    const activeBool = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.seedCardService.findAll(featuredBool, activeBool);
  }

  /**
   * Get featured seed cards (public endpoint)
   */
  @Get('featured')
  findFeatured() {
    return this.seedCardService.findFeatured();
  }

  /**
   * Get seed card by ID (public endpoint)
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.seedCardService.findOne(id);
  }

  /**
   * Get seed card by seedId (public endpoint)
   */
  @Get('seed-id/:seedId')
  findBySeedId(@Param('seedId') seedId: string) {
    return this.seedCardService.findBySeedId(seedId);
  }

  /**
   * Admin: Create a new seed card
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createSeedCardDto: CreateSeedCardDto) {
    return this.seedCardService.create(req.user.id, createSeedCardDto);
  }

  /**
   * Admin: Update a seed card
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateSeedCardDto: UpdateSeedCardDto,
  ) {
    return this.seedCardService.update(req.user.id, id, updateSeedCardDto);
  }

  /**
   * Admin: Delete a seed card
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.seedCardService.remove(req.user.id, id);
  }
}

