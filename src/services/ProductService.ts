import { injectable } from 'inversify';

export interface BasicProductInfo {
    displayName: string;
    variantDisplayName: string;
    image?: string;
}

@injectable()
export class ProductService {
    constructor() {}

    getProductInfo(productId: string): BasicProductInfo {
        //This function needs to be implemented by yourself to get whatever information you need about the product
        //In this example we just return some hardcoded values

        return {
            displayName: 'Nike Air Max 2019',
            variantDisplayName: '36EU - 4US',
            image: 'https://images.unsplash.com/photo-1588484628369-dd7a85bfdc38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHNuZWFrZXJ8ZW58MHx8MHx8&auto=format&fit=crop&w=150&q=60',
        };
    }
}
