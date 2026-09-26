import { Controller, Get, Post, Param, Body, Req, Res, Next } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from "../../../shared/errors/app-error.js";
import { tipFanRateLimiter, tipStreamRateLimiter } from "../services/tip-rate-limiters.js";
import { tipService } from "../services/tip.service.js";
import { createTipSchema } from "../validators/tip.validators.js";

@Controller('tips')
export class TipController {
  @Post()
  async create(@Req() req: Request, @Body() body: any, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const fanUserId = (req as any).userId!;
      const input = createTipSchema.parse(body);

      if (!tipFanRateLimiter.consume(fanUserId)) {
        throw new AppError(429, "RATE_LIMITED", "You're sending tips too quickly. Try again shortly.");
      }

      if (input.streamId && !tipStreamRateLimiter.consume(input.streamId)) {
        throw new AppError(
          429,
          "STREAM_RATE_LIMITED",
          "This stream is receiving too many tips right now. Try again shortly."
        );
      }

      const tip = await tipService.submitTip({ ...input, fanUserId });
      return res.status(201).json(tip);
    } catch (error) {
      next(error);
    }
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const fanUserId = (req as any).userId!;
      const tip = await tipService.getTipForFan(id, fanUserId);
      return res.status(200).json(tip);
    } catch (error) {
      next(error);
    }
  }

  @Post(':id/submit-signed')
  async submitSigned(@Param('id') id: string, @Body() body: any, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const fanUserId = (req as any).userId!;
      const { signedTransactionXdr } = body;

      if (typeof signedTransactionXdr !== "string" || signedTransactionXdr.length === 0) {
        throw new AppError(400, "VALIDATION_ERROR", "signedTransactionXdr is required");
      }

      const tip = await tipService.submitSignedTip(id, fanUserId, signedTransactionXdr);
      return res.status(200).json(tip);
    } catch (error) {
      next(error);
    }
  }

  @Post(':id/retry')
  async retry(@Param('id') id: string, @Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const fanUserId = (req as any).userId!;

      if (!tipFanRateLimiter.consume(fanUserId)) {
        throw new AppError(429, "RATE_LIMITED", "You're sending tips too quickly. Try again shortly.");
      }

      const tip = await tipService.retryTip(id, fanUserId);
      return res.status(201).json(tip);
    } catch (error) {
      next(error);
    }
  }
}
