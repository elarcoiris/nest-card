import { Controller, Get, HttpException, HttpStatus, Param, Headers, Res } from '@nestjs/common';
import { CertificateService } from './service/certificates.service';
import { AppleService } from './apple.service';

@Controller('store-card/apple')
export class AppleController {
    constructor(
        private readonly certificateService: CertificateService,
        private readonly appleService: AppleService
    ) {}

    @Get('user/:userId')
    async getStoreCard(
        @Param('userId') userId: string,
        @Headers('authorization') authorization: string,
        @Res() resp: Response) {
            // if (!authorization) {
            //     throw new HttpException('Authorization header not present',
            //     HttpStatus.BAD_REQUEST)
            // }
            // const [, token] = authorization.split(' ');
            try {
                const keys = await this.certificateService.getKeys();
                const storeCard = await this.appleService.prepareStoreCard()//.prepareStoreCard(userId, false, token);
                storeCard.render(resp, (error) => {
                    if (error) {
                        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                });
            }
            catch (error) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            }
        }
}