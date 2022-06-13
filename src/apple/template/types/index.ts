export interface Basic {
    passTypeIdentifier: string,
    teamIdentifier: string,
    organizationName: string,
    description: string,
    logoText?: string,
    associatedStoreIdentifiers: number[],
    sharingProhibited: boolean,
    webServiceURL?: string
}

export interface Color {
    backgroundColor: string,
    foregroundColor: string,
    labelColor: string,
    stripColor: string
}

export interface Barcode {
    format: string,
    message: string,
    altText: string,
    messageEncoding: string
}

export interface Field {
    key: string,
    label: string,
    value: string
}

export interface StoreCard {
    primaryFields: Field[],
    auxiliaryFields: Field[],
    backFields: Field[]
}

export interface Fields {
    barcode: Barcode,
    serialNumber: string,
    storeCard: StoreCard
}