import {
  Injectable,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';

@Injectable()
export class WebsiteContentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get all active website content
   */
  async findAll() {
    return this.prisma.websiteContent.findMany({
      where: { active: true },
      orderBy: [{ section: 'asc' }, { order: 'asc' }],
    });
  }

  /**
   * Get content by section
   */
  async findBySection(section: string) {
    return this.prisma.websiteContent.findMany({
      where: {
        section: section as any,
        active: true,
      },
      orderBy: { order: 'asc' },
    });
  }

  /**
   * Create new content (admin only)
   */
  async create(userId: string, createContentDto: CreateContentDto) {
    await this.checkAdminRole(userId);

    return this.prisma.websiteContent.create({
      data: createContentDto,
    });
  }

  /**
   * Update content (admin only)
   */
  async update(
    userId: string,
    id: string,
    updateContentDto: UpdateContentDto,
  ) {
    await this.checkAdminRole(userId);

    const content = await this.prisma.websiteContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return this.prisma.websiteContent.update({
      where: { id },
      data: updateContentDto,
    });
  }

  /**
   * Delete content (admin only)
   */
  async remove(userId: string, id: string) {
    await this.checkAdminRole(userId);

    const content = await this.prisma.websiteContent.findUnique({
      where: { id },
    });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    await this.prisma.websiteContent.delete({
      where: { id },
    });

    return { message: 'Content deleted successfully' };
  }

  /**
   * Bulk update content (admin only)
   */
  async bulkUpdate(userId: string, contents: UpdateContentDto[]) {
    await this.checkAdminRole(userId);

    const updates = contents.map((content) =>
      this.prisma.websiteContent.update({
        where: { id: content.id },
        data: content,
      }),
    );

    return Promise.all(updates);
  }

  /**
   * Initialize default website content (admin only)
   */
  async initializeDefaultContent(userId: string) {
    await this.checkAdminRole(userId);

    const defaultContent = [
      // Hero Section
      {
        section: 'HERO',
        key: 'title',
        value: 'Play. Learn. Taste. Grow.',
        order: 1,
      },
      {
        section: 'HERO',
        key: 'subtitle',
        value:
          'Taste & Grow helps schools turn real food into learning and fundraising — with students leading their own school e-market and families ordering online.',
        order: 2,
      },
      {
        section: 'HERO',
        key: 'tagline',
        value: 'Built for schools. Inspired by nature.',
        order: 3,
      },

      // How It Works
      {
        section: 'HOW_IT_WORKS',
        key: 'title',
        value: 'How It Works',
        order: 1,
      },
      {
        section: 'HOW_IT_WORKS',
        key: 'step_1_title',
        value: 'Teacher Registers',
        order: 2,
      },
      {
        section: 'HOW_IT_WORKS',
        key: 'step_1_desc',
        value:
          'Have your class take the lead. Choose one of the three food kits and pick your preferred date.',
        order: 3,
      },
      {
        section: 'HOW_IT_WORKS',
        key: 'step_2_title',
        value: 'Parents Buy Online',
        order: 4,
      },
      {
        section: 'HOW_IT_WORKS',
        key: 'step_2_desc',
        value:
          'Families order easily through a QR code. We deliver everything directly to the school, ready for the big day.',
        order: 5,
      },
      {
        section: 'HOW_IT_WORKS',
        key: 'step_3_title',
        value: 'Students Lead the Market',
        order: 6,
      },
      {
        section: 'HOW_IT_WORKS',
        key: 'step_3_desc',
        value:
          'Students pack, present, and share what they\'ve learned — turning their classroom into a mini market stand.',
        order: 7,
      },
      {
        section: 'HOW_IT_WORKS',
        key: 'step_4_title',
        value: 'School Grows',
        order: 8,
      },
      {
        section: 'HOW_IT_WORKS',
        key: 'step_4_desc',
        value:
          'Each order raises funds and builds community through real, hands-on learning.',
        order: 9,
      },

      // Food Kits
      {
        section: 'FOOD_KIT',
        key: 'section_title',
        value: 'Real Superfoods. Real Learning. Real Impact.',
        order: 1,
      },
      {
        section: 'FOOD_KIT',
        key: 'section_subtitle',
        value:
          'Each Superfood Kit connects classrooms to powerful foods, inspiring students to explore their origins, taste their benefits, and share their story.',
        order: 2,
      },

      // Footer
      {
        section: 'FOOTER',
        key: 'company_name',
        value: 'Taste & Grow',
        order: 1,
      },
      {
        section: 'FOOTER',
        key: 'tagline',
        value: 'Built for schools. Inspired by nature.',
        order: 2,
      },
      {
        section: 'FOOTER',
        key: 'email',
        value: 'hello@tasteandgrow.com',
        order: 3,
      },
      {
        section: 'FOOTER',
        key: 'copyright',
        value: '© 2025 Taste & Grow. All rights reserved.',
        order: 4,
      },
    ];

    // Upsert all default content
    const promises = defaultContent.map((content) =>
      this.prisma.websiteContent.upsert({
        where: {
          section_key: {
            section: content.section as any,
            key: content.key,
          },
        },
        update: {},
        create: content as any,
      }),
    );

    await Promise.all(promises);

    return {
      message: 'Default content initialized successfully',
      count: defaultContent.length,
    };
  }

  /**
   * Check if user is admin
   */
  private async checkAdminRole(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new ForbiddenException('Only admins can manage website content');
    }
  }
}

