import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppleModule } from './apple/apple.module';
import { GoogleModule } from './google/google.module';

@Module({
  imports: [AppleModule, GoogleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
