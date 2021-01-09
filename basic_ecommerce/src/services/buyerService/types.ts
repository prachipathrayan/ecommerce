export interface IBuyerServices{
    getListOfSellers(): Promise<any | Error>;
    getSellerCatalog(id : number): Promise<productDetails[] | Error>
}

export type sellerDetails = {
    id: number;
    name: string;
}

export type productDetails={
    name: string;
    price: number;
}