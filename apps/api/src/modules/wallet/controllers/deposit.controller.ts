import { Controller, Get, Post, Req, Res, Next } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { depositController as legacyDepositController } from './deposit.controller.legacy.js';

@Controller('wallet/deposits')
export class DepositController {
  @Post()
  async create(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    return legacyDepositController.create(req, res, next);
  }

  @Get()
  async list(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    return legacyDepositController.list(req, res, next);
  }

  @Get(':id')
  async getById(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    return legacyDepositController.getById(req, res, next);
  }
}
