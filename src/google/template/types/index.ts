export interface Barcode {
    type: string,
    value: string,
    alternateText: string
}    
export interface LoyaltyObject {
    classId: string,
    id: string,
    state: string,
    hasUsers: null,
    hasLinkedDevice: null,
    smartTapRedemptionValue: null,
    barcode: Barcode,
    linkedOfferIds: null,
    disableExpirationNotification: null,
    kind: null,
    accountName: null,
    version: null,
    textModulesData: {},
    linksModuleData: {uris: []},
    accountId: null,
    loyaltyPoints: LoyaltyPoints,
    objectId: string
} 
export interface UnencodedJWT {
    iss: string,
    aud: string,
    typ: string,
    iat: number,
    origins: [string, string],
    payload: {loyaltyObjects: any[]}
} 
export interface LoyaltyPoints {
    label: string,
    balance: LoyaltyPointsBalance
}
export interface LoyaltyPointsBalance {
    string: any

}