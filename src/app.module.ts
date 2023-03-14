import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/user.module';

@Module({
  imports: [forwardRef(() => UsersModule), forwardRef(() => AuthModule)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
