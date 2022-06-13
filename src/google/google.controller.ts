import { Controller, Get, HttpException, HttpStatus, Param, Res, Headers } from '@nestjs/common';
import { LoyaltyCard } from '../google/template/loyaltyCard';
import { randomBytes } from 'crypto';
import { LoyaltyObject } from './template/types';
import { Response } from 'express';

export interface JWTResponse {
    jwt: LoyaltyObject//string
}

export enum GooglePassUpdateEvent {
    DELETE = 'del',
    SAVE = 'save'
}

export type GooglePassUpdate = {
    classId: string
    objectId: string
    expTimeMillis: number
    eventType: GooglePassUpdateEvent
    nonce: string
}

// Next steps: Register Google account and save account details

@Controller('store-card/google')
export class GoogleController {
    constructor(
        private readonly loyaltyCard: LoyaltyCard
    ) {}

    @Get('user/:userId/pass')
    async createLoyaltyCard(
        @Param('userId') userId: string,
        @Headers('authorization') token: string,
        @Res() resp: Response) {
            // if (!authorization) {
            //     throw new HttpException('Authorization header not present',
            //     HttpStatus.BAD_REQUEST)
            // }
            // const [, token] = authorization.split(' ');
            const objectUid = `LOYALTY_OBJECT_${userId}_${randomBytes(16).toString('hex')}`
            const GOOGLE_ISSUER_ID = 'GOOGLE_ISSUER_ID';
            const objectId = `${GOOGLE_ISSUER_ID}.${objectUid}`;

            try {
                const signedJWT = await this.loyaltyCard.createLoyaltyObject(
                    'CLASSID',
                    objectId,
                    userId,
                    token
                )
                if (!signedJWT) {
                    throw new Error('Failed to generate JWT');
                }

                const jwtResponse: JWTResponse = {
                    jwt: signedJWT
                }
                resp.status(HttpStatus.OK).json(jwtResponse);
            }
            catch (error) {
                throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

    
}