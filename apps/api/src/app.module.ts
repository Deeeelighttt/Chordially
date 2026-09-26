import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module.js';
import { UserModule } from './modules/users/user.module.js';
import { CreatorModule } from './modules/creators/creator.module.js';

@Module({
  imports: [AuthModule, UserModule, CreatorModule],
})
export class AppModule {}
