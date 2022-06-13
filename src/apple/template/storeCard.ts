import { Template } from 'passbook';
import { Barcode, Basic, Color, StoreCard } from './types';

export class AppleStoreCard {

    private readonly faqLink = `https://example.com`;
    private readonly webServiceUrl = `webServiceUrl`;

    constructor() {
    }

    basic: Basic = {
        passTypeIdentifier: 'pass.com.inspirare.tech.wallet',
        teamIdentifier: '1234556',
        organizationName: 'Inspirare Tech',
        description: 'Inspirare Tech',
        logoText: '',
        associatedStoreIdentifiers: [987654321],
        sharingProhibited: true
    };

    color: Color = {
        backgroundColor: 'rgb(250, 250, 250)',
        foregroundColor: 'rgb(0, 0, 0)',
        labelColor: 'rgb(0, 0, 0)',
        stripColor: 'rgb(0, 0, 0)'
    };

    barcode: Barcode = {
        format: 'PKBarcodeFormatCode128',
        message: '',
        altText: '',
        messageEncoding: 'iso-8859-1'
    }

    storeCard: StoreCard = {
        primaryFields: [
            {
                key: 'name',
                label: '',
                value: ''
            }
        ],
        auxiliaryFields: [],
        backFields: [
            {
                key: 'faq',
                label: `FAQ'S`,
                value: this.faqLink.link(this.faqLink)
            }
        ]
    }

    async createTemplate(userId: string, passName: string, templateKeys: [string, string], barcode: string, token: string, pin: string): Promise<any> {
        let auxiliaryFields: {};
        if (pin) {
            auxiliaryFields = [
                {
                    key: 'Membership',
                    label: 'Membership',
                    value: userId
                },
                {
                    key: 'Pin',
                    label: 'Pin',
                    value: pin,
                    changeMessage: 'Pin number updated %@'
                }
            ]
        }
        else {
            auxiliaryFields = [
                {
                    key: 'Membership',
                    label: 'Membership',
                    value: userId
                }
            ]
        }

        const template = new Template(passName, {
            ...this.basic,
            ...this.color,
            serialNumber: `${userId}`,
            storeCard: {
                ...this.storeCard,
                auxiliaryFields
            }
        });

        template.fields.barcode = {
            'format': 'PKBarcodeFormatCode128',
            'message': barcode,
            'altText': barcode,
            'messageEncoding': 'iso-8859-1'
        };

        template.keys(templateKeys[0], templateKeys[1]);
        template.fields.authenticationToken = token;
        template.fields.sharingProhibited = true;
        template.fields.webServiceURL = this.webServiceUrl;
        template.fields.formatVersion = 1;
        await template.images.loadFromDirectory('./assets');
        return Promise.resolve(template);
    }
}