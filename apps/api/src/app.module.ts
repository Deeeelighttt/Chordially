import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/users/user.module.js';
import { CreatorModule } from './modules/creators/creator.module.js';
import { WalletModule } from './modules/wallet/wallet.module.js';

@Module({
  imports: [AuthModule, UserModule, CreatorModule, WalletModule],
})
export class AppModule {}
