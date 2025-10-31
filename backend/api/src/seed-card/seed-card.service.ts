import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSeedCardDto } from './dto/create-seed-card.dto';
import { UpdateSeedCardDto } from './dto/update-seed-card.dto';

@Injectable()
export class SeedCardService {
  constructor(private prisma: PrismaService) {}

  /**
   * Check if user is admin
   */
  private async checkAdminRole(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can perform this action');
    }
  }

  /**
   * Convert database status to display status
   */
  private convertStatusForDisplay(status: string): string {
    return status === 'AtRisk' ? 'At Risk' : status;
  }

  /**
   * Convert display status to database status
   */
  private convertStatusForDatabase(status: string): string {
    return status === 'At Risk' ? 'AtRisk' : status;
  }

  /**
   * Transform seed card for API response
   */
  private transformSeedCard(card: any) {
    return {
      ...card,
      status: this.convertStatusForDisplay(card.status),
    };
  }

  /**
   * Get all seed cards (public endpoint)
   */
  async findAll(featured?: boolean, active?: boolean) {
    const where: any = {};
    
    if (featured !== undefined) {
      where.featured = featured;
    }
    
    if (active !== undefined) {
      where.active = active;
    } else {
      where.active = true;
    }

    const cards = await this.prisma.seedCard.findMany({
      where,
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'asc' }],
    });

    return cards.map(card => this.transformSeedCard(card));
  }

  /**
   * Get seed card by ID (public endpoint)
   */
  async findOne(id: string) {
    const seedCard = await this.prisma.seedCard.findUnique({
      where: { id },
    });

    if (!seedCard) {
      throw new NotFoundException('Seed card not found');
    }

    return this.transformSeedCard(seedCard);
  }

  /**
   * Get seed card by seedId (public endpoint)
   */
  async findBySeedId(seedId: string) {
    const seedCard = await this.prisma.seedCard.findUnique({
      where: { seedId },
    });

    if (!seedCard) {
      throw new NotFoundException('Seed card not found');
    }

    return this.transformSeedCard(seedCard);
  }

  /**
   * Get featured seed cards (public endpoint)
   */
  async findFeatured() {
    const cards = await this.prisma.seedCard.findMany({
      where: {
        featured: true,
        active: true,
      },
      orderBy: { order: 'asc' },
    });

    return cards.map(card => this.transformSeedCard(card));
  }

  /**
   * Admin: Create a new seed card
   */
  async create(userId: string, createSeedCardDto: CreateSeedCardDto) {
    await this.checkAdminRole(userId);

    // Check if seedId already exists
    const existing = await this.prisma.seedCard.findUnique({
      where: { seedId: createSeedCardDto.seedId },
    });

    if (existing) {
      throw new ConflictException('Seed card with this seedId already exists');
    }

    const created = await this.prisma.seedCard.create({
      data: {
        seedId: createSeedCardDto.seedId,
        commonName: createSeedCardDto.commonName,
        scientific: createSeedCardDto.scientific,
        type: createSeedCardDto.type,
        region: createSeedCardDto.region,
        status: this.convertStatusForDatabase(createSeedCardDto.status) as any,
        era: createSeedCardDto.era,
        rarity: createSeedCardDto.rarity,
        ageYears: createSeedCardDto.ageYears,
        story: createSeedCardDto.story,
        tasteProfile: createSeedCardDto.tasteProfile as any,
        images: createSeedCardDto.images,
        sources: createSeedCardDto.sources || [],
        featured: createSeedCardDto.featured || false,
        locked: createSeedCardDto.locked || false,
        order: createSeedCardDto.order || 0,
        active: createSeedCardDto.active !== undefined ? createSeedCardDto.active : true,
      },
    });

    return this.transformSeedCard(created);
  }

  /**
   * Admin: Update a seed card
   */
  async update(
    userId: string,
    id: string,
    updateSeedCardDto: UpdateSeedCardDto,
  ) {
    await this.checkAdminRole(userId);

    const seedCard = await this.prisma.seedCard.findUnique({
      where: { id },
    });

    if (!seedCard) {
      throw new NotFoundException('Seed card not found');
    }

    // If seedId is being updated, check if it already exists
    if (updateSeedCardDto.seedId && updateSeedCardDto.seedId !== seedCard.seedId) {
      const existing = await this.prisma.seedCard.findUnique({
        where: { seedId: updateSeedCardDto.seedId },
      });

      if (existing) {
        throw new ConflictException('Seed card with this seedId already exists');
      }
    }

    const updateData: any = {
      ...(updateSeedCardDto.seedId && { seedId: updateSeedCardDto.seedId }),
      ...(updateSeedCardDto.commonName && { commonName: updateSeedCardDto.commonName }),
      ...(updateSeedCardDto.scientific && { scientific: updateSeedCardDto.scientific }),
      ...(updateSeedCardDto.type && { type: updateSeedCardDto.type }),
      ...(updateSeedCardDto.region && { region: updateSeedCardDto.region }),
      ...(updateSeedCardDto.status && { status: this.convertStatusForDatabase(updateSeedCardDto.status) as any }),
      ...(updateSeedCardDto.era && { era: updateSeedCardDto.era }),
      ...(updateSeedCardDto.rarity && { rarity: updateSeedCardDto.rarity }),
      ...(updateSeedCardDto.ageYears !== undefined && { ageYears: updateSeedCardDto.ageYears }),
      ...(updateSeedCardDto.story && { story: updateSeedCardDto.story }),
      ...(updateSeedCardDto.tasteProfile && { tasteProfile: updateSeedCardDto.tasteProfile as any }),
      ...(updateSeedCardDto.images && { images: updateSeedCardDto.images }),
      ...(updateSeedCardDto.sources && { sources: updateSeedCardDto.sources }),
      ...(updateSeedCardDto.featured !== undefined && { featured: updateSeedCardDto.featured }),
      ...(updateSeedCardDto.locked !== undefined && { locked: updateSeedCardDto.locked }),
      ...(updateSeedCardDto.order !== undefined && { order: updateSeedCardDto.order }),
      ...(updateSeedCardDto.active !== undefined && { active: updateSeedCardDto.active }),
    };

    const updated = await this.prisma.seedCard.update({
      where: { id },
      data: updateData,
    });

    return this.transformSeedCard(updated);
  }

  /**
   * Admin: Delete a seed card
   */
  async remove(userId: string, id: string) {
    await this.checkAdminRole(userId);

    const seedCard = await this.prisma.seedCard.findUnique({
      where: { id },
    });

    if (!seedCard) {
      throw new NotFoundException('Seed card not found');
    }

    await this.prisma.seedCard.delete({
      where: { id },
    });

    return { message: 'Seed card deleted successfully' };
  }
}

