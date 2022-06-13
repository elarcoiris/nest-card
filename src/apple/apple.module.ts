import { Module } from '@nestjs/common';
import { AppleController } from './apple.controller';
import { CertificateService } from './service/certificates.service';
import { AppleService } from './apple.service';
import { AppleStoreCard } from './template/storeCard';

@Module({
    controllers: [
        AppleController
    ],
    providers: [
        CertificateService,
        AppleService,
        AppleStoreCard
    ]
})
export class AppleModule {}