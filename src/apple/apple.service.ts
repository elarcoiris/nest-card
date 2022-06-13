import { Injectable, Inject } from '@nestjs/common';
import { AwsClient } from 'src/utils/awsClient';

@Injectable()
export class AppleService {
    constructor() {}

    async prepareStoreCard(): Promise<any> {//(memberId: string, isUpdate: boolean, token?: string) {
        
    }
}