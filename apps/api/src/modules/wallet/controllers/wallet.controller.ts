import { Controller, Get, Post, Req, Res, Next, Query } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { AppError } from "../../../shared/errors/app-error.js";
import { issueWalletLinkChallenge } from "../../../shared/wallet-link/challenge.js";
import { walletService } from "../services/wallet.service.js";

@Controller('wallet')
export class WalletController {
  @Get('link-challenge')
  getLinkChallenge(@Query('publicKey') publicKey: string, @Res() res: Response, @Next() next: NextFunction) {
    try {
      if (typeof publicKey !== "string" || !/^G[A-Z0-9]{55}$/.test(publicKey)) {
        throw new AppError(400, "VALIDATION_ERROR", "A valid Stellar publicKey query param is required");
      }

      const { challenge, nonce } = issueWalletLinkChallenge(publicKey);
      return res.status(200).json({ challenge, nonce });
    } catch (error) {
      next(error);
    }
  }

  @Get('me')
  async getMe(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const userId = (req as any).userId!;
      const wallet = await walletService.getWalletForUser(userId);
      return res.status(200).json(wallet);
    } catch (error) {
      next(error);
    }
  }

  @Post('usdc-trustline')
  async establishUsdcTrustline(@Req() req: Request, @Res() res: Response, @Next() next: NextFunction) {
    try {
      const userId = (req as any).userId!;
      const result = await walletService.establishUsdcTrustline(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
