import { Controller, Get, Param, Res, Next } from '@nestjs/common';
import type { Response, NextFunction } from 'express';
import { creatorService } from "../services/creator.service.js";
import { toCreatorResponse } from "../types/creator.types.js";
import { AppError } from "../../../shared/errors/app-error.js";

@Controller('creators')
export class CreatorController {
  @Get(':slug')
  async getBySlug(@Param('slug') slug: string, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const profile = await creatorService.findBySlug(slug);

      if (!profile) {
        throw new AppError(404, "CREATOR_NOT_FOUND", "Creator profile not found");
      }

      return res.status(200).json(toCreatorResponse(profile));
    } catch (error) {
      next(error);
    }
  }
}
