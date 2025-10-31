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
      // Hero Section (New Website)
      {
        section: 'HERO',
        key: 'animated',
        value: JSON.stringify(['Play.', 'Learn.', 'Taste.', 'Grow.']),
        order: 1,
      },
      {
        section: 'HERO',
        key: 'description',
        value:
          'Taste & Grow is a playful science platform where classrooms explore forgotten foods, rediscover lost flavors, and protect the world\'s disappearing biodiversity — one seed at a time.',
        order: 2,
      },
      {
        section: 'HERO',
        key: 'cta',
        value: 'Register Your Class',
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

      // Cinematic Intro Section (New Website)
      {
        section: 'CINEMATIC_INTRO',
        key: 'title',
        value: 'The World Is Losing Its Taste',
        order: 1,
      },
      {
        section: 'CINEMATIC_INTRO',
        key: 'description',
        value: 'In the past 100 years, nearly 75% of the world\'s edible plant varieties have disappeared.',
        order: 2,
      },
      {
        section: 'CINEMATIC_INTRO',
        key: 'description2',
        value: 'Every time a traditional fruit or grain vanishes, we lose flavor, nutrition, and knowledge — parts of our story we can never taste again.',
        order: 3,
      },
      {
        section: 'CINEMATIC_INTRO',
        key: 'stat1',
        value: 'Food varieties lost in the last 100 years',
        order: 4,
      },
      {
        section: 'CINEMATIC_INTRO',
        key: 'stat2',
        value: 'Still Possible to Protect',
        order: 5,
      },
      {
        section: 'CINEMATIC_INTRO',
        key: 'stat3',
        value: 'Foods That Can Be Saved Worldwide',
        order: 6,
      },

      // Mission Roles Section (New Website)
      {
        section: 'MISSION_ROLES',
        key: 'title',
        value: 'Select Your Role',
        order: 1,
      },
      {
        section: 'MISSION_ROLES',
        key: 'subtitle',
        value: 'Every child becomes a hero in the Taste & Grow world. Each role helps protect our planet\'s forgotten foods and brings biodiversity back to life. Your mission begins here.',
        order: 2,
      },
      {
        section: 'MISSION_ROLES',
        key: 'footerNote',
        value: 'More missions unlock as the World Seed Bank grows.',
        order: 3,
      },
      {
        section: 'MISSION_ROLES',
        key: 'startMission',
        value: 'Start Your Mission',
        order: 4,
      },
      {
        section: 'MISSION_ROLES',
        key: 'comingSoon',
        value: 'Coming Soon',
        order: 5,
      },
      // Mission Roles - Seed Guardian
      {
        section: 'MISSION_ROLES',
        key: 'role_seedGuardian_name',
        value: 'Seed Guardian',
        order: 6,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_seedGuardian_title',
        value: 'Kids',
        order: 7,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_seedGuardian_mission',
        value: 'Collect, taste, and protect lost seeds.',
        order: 8,
      },
      // Mission Roles - Knowledge Keeper
      {
        section: 'MISSION_ROLES',
        key: 'role_knowledgeKeeper_name',
        value: 'Knowledge Keeper',
        order: 9,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_knowledgeKeeper_title',
        value: 'Teacher',
        order: 10,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_knowledgeKeeper_mission',
        value: 'Guide young minds to become Seed Guardians.',
        order: 11,
      },
      // Mission Roles - Earth Builder
      {
        section: 'MISSION_ROLES',
        key: 'role_earthBuilder_name',
        value: 'Earth Builder',
        order: 12,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_earthBuilder_title',
        value: 'Grower',
        order: 13,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_earthBuilder_mission',
        value: 'Cultivate heritage crops and restore biodiversity.',
        order: 14,
      },
      // Mission Roles - Home Nurturer
      {
        section: 'MISSION_ROLES',
        key: 'role_homeNurturer_name',
        value: 'Home Nurturer',
        order: 15,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_homeNurturer_title',
        value: 'Parent',
        order: 16,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_homeNurturer_mission',
        value: 'Grow food stories and healthy habits at home.',
        order: 17,
      },
      // Mission Roles - Seed Keeper
      {
        section: 'MISSION_ROLES',
        key: 'role_seedKeeper_name',
        value: 'Seed Keeper',
        order: 18,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_seedKeeper_title',
        value: 'Researcher',
        order: 19,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_seedKeeper_mission',
        value: 'Study, document, and preserve genetic diversity.',
        order: 20,
      },
      // Mission Roles - Pollinator
      {
        section: 'MISSION_ROLES',
        key: 'role_pollinator_name',
        value: 'Pollinator',
        order: 21,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_pollinator_title',
        value: 'Volunteer / Donor',
        order: 22,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_pollinator_mission',
        value: 'Support the mission through donations or community action.',
        order: 23,
      },
      // Mission Roles - World Builder
      {
        section: 'MISSION_ROLES',
        key: 'role_worldBuilder_name',
        value: 'World Builder',
        order: 24,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_worldBuilder_title',
        value: 'Company / Partner',
        order: 25,
      },
      {
        section: 'MISSION_ROLES',
        key: 'role_worldBuilder_mission',
        value: 'Help expand the World Seed Bank through investment or collaboration.',
        order: 26,
      },

      // Mission Cards Section (New Website)
      {
        section: 'MISSION_CARDS',
        key: 'title',
        value: 'Every Class Has a Mission',
        order: 1,
      },
      {
        section: 'MISSION_CARDS',
        key: 'subtitle',
        value: 'Each mission is a new step in the adventure — start your training, unlock stories, take action, and protect real seeds.',
        order: 2,
      },
      // Mission 1
      {
        section: 'MISSION_CARDS',
        key: 'mission1_ageRange',
        value: 'Ages 5-10',
        order: 3,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission1_title',
        value: 'Build a Seed Collection',
        order: 4,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission1_description',
        value: 'Students adopt heritage fruits and vegetables, color their cards, and build a classroom Seed Wall.',
        order: 5,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission1_button',
        value: 'Start Collecting →',
        order: 6,
      },
      // Mission 2
      {
        section: 'MISSION_CARDS',
        key: 'mission2_ageRange',
        value: 'Ages 7-12',
        order: 7,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission2_title',
        value: 'Seed Guardian Book',
        order: 8,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission2_description',
        value: 'Students discover the Seed Guardians story and create their own pages linking imagination and real heritage foods.',
        order: 9,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission2_button',
        value: 'Become a Guardian →',
        order: 10,
      },
      // Mission 3
      {
        section: 'MISSION_CARDS',
        key: 'mission3_ageRange',
        value: 'Ages 12-17',
        order: 11,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission3_title',
        value: 'Heritage e-Market',
        order: 12,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission3_description',
        value: 'Students lead a real school market where parents order heritage products through a QR code.',
        order: 13,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission3_button',
        value: 'Start e-Market →',
        order: 14,
      },
      // Mission 4
      {
        section: 'MISSION_CARDS',
        key: 'mission4_ageRange',
        value: 'Ages 12-17',
        order: 15,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission4_title',
        value: 'Build a Real Seed Bank',
        order: 16,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission4_description',
        value: 'Students become Master Guardians, helping track and protect real seeds with growers worldwide.',
        order: 17,
      },
      {
        section: 'MISSION_CARDS',
        key: 'mission4_button',
        value: 'Join the Waitlist →',
        order: 18,
      },

      // Seed Cards Section (New Website)
      {
        section: 'SEED_CARDS',
        key: 'title',
        value: 'The Seed Vault',
        order: 1,
      },
      {
        section: 'SEED_CARDS',
        key: 'subtitle',
        value: 'Explore the foods from your country that we can still protect — each one waiting for a new guardian. Learn their stories, adopt a seed, and help keep the world\'s flavors alive.',
        order: 2,
      },
      {
        section: 'SEED_CARDS',
        key: 'downloadPrintable',
        value: 'Download Printable',
        order: 3,
      },
      {
        section: 'SEED_CARDS',
        key: 'enterVault',
        value: 'Enter the Seed Vault',
        order: 4,
      },

      // Final CTA Section (New Website)
      {
        section: 'FINAL_CTA',
        key: 'title',
        value: 'Together, We Keep the Taste Alive',
        order: 1,
      },
      {
        section: 'FINAL_CTA',
        key: 'description',
        value: 'One seed, one fruit, one story at a time — we can keep the world\'s flavors alive for generations to come.',
        order: 2,
      },
      {
        section: 'FINAL_CTA',
        key: 'cta',
        value: 'Register Your Class',
        order: 3,
      },
      {
        section: 'FINAL_CTA',
        key: 'tagline',
        value: 'Protecting seeds, one class at a time',
        order: 4,
      },

      // Footer Section (New Website)
      {
        section: 'FOOTER',
        key: 'about_description',
        value: 'Connecting schools, families, and growers to protect food heritage worldwide.',
        order: 1,
      },
      {
        section: 'FOOTER',
        key: 'copyright',
        value: '© 2024 Taste & Grow. Protecting food heritage worldwide.',
        order: 2,
      },
    ];

    // Add all default content (only if it doesn't exist - won't replace existing)
    const promises = defaultContent.map(async (content) => {
      // Check if content already exists
      const existing = await this.prisma.websiteContent.findUnique({
        where: {
          section_key: {
            section: content.section as any,
            key: content.key,
          },
        },
      });

      // Only create if it doesn't exist (don't replace existing roles/content)
      if (!existing) {
        return this.prisma.websiteContent.create({
          data: content as any,
        });
      }

      return existing;
    });

    await Promise.all(promises);

    return {
      message: 'Default content initialized successfully',
      count: defaultContent.length,
    };
  }

  /**
   * Get all mission roles (admin only)
   */
  async getAllMissionRoles(userId: string) {
    await this.checkAdminRole(userId);

    const allRoles = await this.prisma.websiteContent.findMany({
      where: {
        section: 'MISSION_ROLES',
        key: {
          startsWith: 'role_',
        },
      },
      orderBy: { order: 'asc' },
    });

    // Group by role ID (e.g., role_seedGuardian_name -> seedGuardian)
    const rolesMap = new Map<string, any>();

    allRoles.forEach((item) => {
      const parts = item.key.split('_');
      if (parts.length >= 3 && parts[0] === 'role') {
        const roleId = parts[1]; // e.g., seedGuardian
        const field = parts.slice(2).join('_'); // e.g., name, title, mission

        if (!rolesMap.has(roleId)) {
          rolesMap.set(roleId, {
            id: roleId,
            contentIds: {},
          });
        }

        const role = rolesMap.get(roleId);
        role[field] = item.value;
        role.contentIds[field] = item.id;
      }
    });

    return Array.from(rolesMap.values()).map((role) => ({
      id: role.id,
      name: role.name || '',
      title: role.title || '',
      mission: role.mission || '',
      link: role.link || '',
      bgColor: role.bgColor || '',
      contentIds: role.contentIds,
    }));
  }

  /**
   * Create a new mission role (admin only)
   */
  async createMissionRole(userId: string, createDto: any) {
    await this.checkAdminRole(userId);

    // Get the current max order for roles
    const existingRoles = await this.prisma.websiteContent.findMany({
      where: {
        section: 'MISSION_ROLES',
        key: {
          startsWith: 'role_',
        },
      },
      orderBy: { order: 'desc' },
      take: 1,
    });

    const baseOrder = existingRoles.length > 0 ? existingRoles[0].order + 1 : 6;
    const roleId = createDto.id || createDto.name.toLowerCase().replace(/\s+/g, '');

    const contentToCreate = [
      {
        section: 'MISSION_ROLES',
        key: `role_${roleId}_name`,
        value: createDto.name,
        order: baseOrder,
      },
      {
        section: 'MISSION_ROLES',
        key: `role_${roleId}_title`,
        value: createDto.title,
        order: baseOrder + 1,
      },
      {
        section: 'MISSION_ROLES',
        key: `role_${roleId}_mission`,
        value: createDto.mission,
        order: baseOrder + 2,
      },
    ];

    if (createDto.link) {
      contentToCreate.push({
        section: 'MISSION_ROLES',
        key: `role_${roleId}_link`,
        value: createDto.link,
        order: baseOrder + 3,
      });
    }

    if (createDto.bgColor) {
      contentToCreate.push({
        section: 'MISSION_ROLES',
        key: `role_${roleId}_bgColor`,
        value: createDto.bgColor,
        order: baseOrder + 4,
      });
    }

    const created = await Promise.all(
      contentToCreate.map((content) =>
        this.prisma.websiteContent.create({ data: content as any }),
      ),
    );

    return {
      id: roleId,
      name: createDto.name,
      title: createDto.title,
      mission: createDto.mission,
      link: createDto.link || '',
      bgColor: createDto.bgColor || '',
      contentIds: {
        name: created.find((c) => c.key.endsWith('_name'))?.id,
        title: created.find((c) => c.key.endsWith('_title'))?.id,
        mission: created.find((c) => c.key.endsWith('_mission'))?.id,
        link: created.find((c) => c.key.endsWith('_link'))?.id,
        bgColor: created.find((c) => c.key.endsWith('_bgColor'))?.id,
      },
    };
  }

  /**
   * Update a mission role (admin only)
   */
  async updateMissionRole(userId: string, roleId: string, updateDto: any) {
    await this.checkAdminRole(userId);

    const updates: Promise<any>[] = [];

    if (updateDto.name !== undefined) {
      const nameContent = await this.prisma.websiteContent.findFirst({
        where: {
          section: 'MISSION_ROLES',
          key: `role_${roleId}_name`,
        },
      });
      if (nameContent) {
        updates.push(
          this.prisma.websiteContent.update({
            where: { id: nameContent.id },
            data: { value: updateDto.name },
          }),
        );
      }
    }

    if (updateDto.title !== undefined) {
      const titleContent = await this.prisma.websiteContent.findFirst({
        where: {
          section: 'MISSION_ROLES',
          key: `role_${roleId}_title`,
        },
      });
      if (titleContent) {
        updates.push(
          this.prisma.websiteContent.update({
            where: { id: titleContent.id },
            data: { value: updateDto.title },
          }),
        );
      }
    }

    if (updateDto.mission !== undefined) {
      const missionContent = await this.prisma.websiteContent.findFirst({
        where: {
          section: 'MISSION_ROLES',
          key: `role_${roleId}_mission`,
        },
      });
      if (missionContent) {
        updates.push(
          this.prisma.websiteContent.update({
            where: { id: missionContent.id },
            data: { value: updateDto.mission },
          }),
        );
      }
    }

    if (updateDto.link !== undefined) {
      const linkContent = await this.prisma.websiteContent.findFirst({
        where: {
          section: 'MISSION_ROLES',
          key: `role_${roleId}_link`,
        },
      });
      if (linkContent) {
        updates.push(
          this.prisma.websiteContent.update({
            where: { id: linkContent.id },
            data: { value: updateDto.link },
          }),
        );
      } else if (updateDto.link) {
        // Create link if it doesn't exist
        const existing = await this.prisma.websiteContent.findFirst({
          where: { section: 'MISSION_ROLES', key: `role_${roleId}_mission` },
        });
        updates.push(
          this.prisma.websiteContent.create({
            data: {
              section: 'MISSION_ROLES',
              key: `role_${roleId}_link`,
              value: updateDto.link,
              order: existing ? existing.order + 1 : 100,
            } as any,
          }),
        );
      }
    }

    if (updateDto.bgColor !== undefined) {
      const bgColorContent = await this.prisma.websiteContent.findFirst({
        where: {
          section: 'MISSION_ROLES',
          key: `role_${roleId}_bgColor`,
        },
      });
      if (bgColorContent) {
        updates.push(
          this.prisma.websiteContent.update({
            where: { id: bgColorContent.id },
            data: { value: updateDto.bgColor },
          }),
        );
      } else if (updateDto.bgColor) {
        // Create bgColor if it doesn't exist
        const existing = await this.prisma.websiteContent.findFirst({
          where: { section: 'MISSION_ROLES', key: `role_${roleId}_mission` },
        });
        updates.push(
          this.prisma.websiteContent.create({
            data: {
              section: 'MISSION_ROLES',
              key: `role_${roleId}_bgColor`,
              value: updateDto.bgColor,
              order: existing ? existing.order + 2 : 101,
            } as any,
          }),
        );
      }
    }

    await Promise.all(updates);

    // Return updated role
    const allRoles = await this.getAllMissionRoles(userId);
    return allRoles.find((r) => r.id === roleId);
  }

  /**
   * Delete a mission role (admin only)
   */
  async deleteMissionRole(userId: string, roleId: string) {
    await this.checkAdminRole(userId);

    const roleContent = await this.prisma.websiteContent.findMany({
      where: {
        section: 'MISSION_ROLES',
        key: {
          startsWith: `role_${roleId}_`,
        },
      },
    });

    await Promise.all(
      roleContent.map((content) =>
        this.prisma.websiteContent.delete({ where: { id: content.id } }),
      ),
    );

    return { message: 'Mission role deleted successfully' };
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

