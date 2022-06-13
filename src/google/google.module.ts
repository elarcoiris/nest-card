import { Module } from '@nestjs/common';
import { GoogleController } from './google.controller';
import { GoogleService } from './google.service';
import { LoyaltyCard } from './template/loyaltyCard';

@Module({
    controllers: [
        GoogleController
    ],
    providers: [
        GoogleService,
        LoyaltyCard
    ]
})
export class GoogleModule {}