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
} from '@nestjs/common';
import { WebsiteContentService } from './website-content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { CreateMissionRoleDto, UpdateMissionRoleDto } from './dto/mission-role.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('website-content')
export class WebsiteContentController {
  constructor(private readonly contentService: WebsiteContentService) {}

  /**
   * Get all website content (public endpoint for website)
   */
  @Get()
  findAll() {
    return this.contentService.findAll();
  }

  /**
   * Get content by section (public)
   */
  @Get('section/:section')
  findBySection(@Param('section') section: string) {
    return this.contentService.findBySection(section);
  }

  /**
   * Admin: Create new content
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Request() req, @Body() createContentDto: CreateContentDto) {
    return this.contentService.create(req.user.id, createContentDto);
  }

  /**
   * Admin: Update content
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateContentDto: UpdateContentDto,
  ) {
    return this.contentService.update(req.user.id, id, updateContentDto);
  }

  /**
   * Admin: Delete content
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Request() req, @Param('id') id: string) {
    return this.contentService.remove(req.user.id, id);
  }

  /**
   * Admin: Bulk update content
   */
  @UseGuards(JwtAuthGuard)
  @Post('bulk-update')
  bulkUpdate(@Request() req, @Body() contents: UpdateContentDto[]) {
    return this.contentService.bulkUpdate(req.user.id, contents);
  }

  /**
   * Admin: Initialize default content
   */
  @UseGuards(JwtAuthGuard)
  @Post('initialize')
  initialize(@Request() req) {
    return this.contentService.initializeDefaultContent(req.user.id);
  }

  /**
   * Admin: Get all mission roles
   */
  @UseGuards(JwtAuthGuard)
  @Get('mission-roles')
  getAllMissionRoles(@Request() req) {
    return this.contentService.getAllMissionRoles(req.user.id);
  }

  /**
   * Admin: Create a new mission role
   */
  @UseGuards(JwtAuthGuard)
  @Post('mission-roles')
  createMissionRole(@Request() req, @Body() createDto: CreateMissionRoleDto) {
    return this.contentService.createMissionRole(req.user.id, createDto);
  }

  /**
   * Admin: Update a mission role
   */
  @UseGuards(JwtAuthGuard)
  @Patch('mission-roles/:roleId')
  updateMissionRole(
    @Request() req,
    @Param('roleId') roleId: string,
    @Body() updateDto: UpdateMissionRoleDto,
  ) {
    return this.contentService.updateMissionRole(req.user.id, roleId, updateDto);
  }

  /**
   * Admin: Delete a mission role
   */
  @UseGuards(JwtAuthGuard)
  @Delete('mission-roles/:roleId')
  deleteMissionRole(@Request() req, @Param('roleId') roleId: string) {
    return this.contentService.deleteMissionRole(req.user.id, roleId);
  }
}

