import { Injectable } from '@nestjs/common';
import { Barcode, LoyaltyObject, UnencodedJWT, LoyaltyPoints, LoyaltyPointsBalance } from './types';

@Injectable()
export class LoyaltyCard {
    barcode: Barcode = {
        type: 'CODE_128',
        value: '',
        alternateText: ''
    };

    loyaltyPointsBalance: LoyaltyPointsBalance = {
        string: ''
    }

    loyaltyPoints: LoyaltyPoints = {
        label: 'Pin:',
        balance: this.loyaltyPointsBalance
    }

    loyaltyObject: LoyaltyObject = {
        classId: '',
        objectId: '',
        id: '',
        state: 'active',
        hasUsers: null,
        hasLinkedDevice: null,
        smartTapRedemptionValue: null,
        barcode: this.barcode,
        linkedOfferIds: null,
        disableExpirationNotification: null,
        kind: null,
        accountName: null,
        version: null,
        textModulesData: [],
        linksModuleData: {uris: []},
        accountId: null,
        loyaltyPoints: this.loyaltyPoints,
    }

    unecodedJWT: UnencodedJWT = {
        iss: 'example-card@example-card.iam.gserviceaccount.com',
        aud: 'google',
        typ: 'savetoandroidpay',
        iat: 0,
        origins: [
            'http:\/\/localhost:3000',
            'http:\/\/www.inspirare.tech'
        ],
        payload: {
            loyaltyObjects: []
        }
    }

    constructor() {}

    async createLoyaltyObject(classId, objectId, userId, pin): Promise<LoyaltyObject> {
        const barcodeNum = ''
        this.barcode.value = barcodeNum;
        this.barcode.alternateText = barcodeNum;
        this.loyaltyPointsBalance.string = pin;

        const loyaltyObject = this.loyaltyObject;
        loyaltyObject.barcode = this.barcode;
        loyaltyObject.classId = classId;
        loyaltyObject.objectId = objectId;
        loyaltyObject.textModulesData = [{
            body: userId,
            header: 'Membership',
            id: null
        }]
        return loyaltyObject;
    }

    getUncodedJWT(loyaltyObject: LoyaltyObject) {
        const date = new Date();
        const seconds = Math.ceil(date.getTime() / 1000);
        this.unecodedJWT.iat = seconds;
        this.unecodedJWT.payload = {
            loyaltyObjects: [loyaltyObject]
        };
        return this.unecodedJWT;
    }

    async generateJWT(classId, objectId, userId, token, pin) {
        try {
            // token used for getPin
            const payload = this.getUncodedJWT(await this.createLoyaltyObject(classId, objectId, userId, pin));
            const googleKey = 'GOOGLE_SERVICE_ACCOUNT_PK';
            const base64String = Buffer.from(googleKey, 'base64').toString();
            const pk = Buffer.from(base64String, 'base64').toString('ascii');
            const jws = await import('jws');
            return jws.sign({
                header: { alg: 'RS256', typ: 'JWT'},
                payload,
                pk
            });
        }
        catch (error) {
            console.error(error);
        }
    }
}