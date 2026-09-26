import { Module } from '@nestjs/common';
import { WalletController } from './controllers/wallet.controller.js';
import { DepositController } from './controllers/deposit.controller.js';

@Module({
  controllers: [WalletController, DepositController],
})
export class WalletModule {}
