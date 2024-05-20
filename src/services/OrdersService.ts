import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import {
    CurrencyCode,
    GetOrderDocument,
    GetOrderQuery,
    GetOrderQueryVariables,
    OrderStatus,
    UpsertOrdersDocument,
    UpsertOrdersMutation,
    UpsertOrdersMutationVariables,
} from '@/graphql/cloudshelf/generated/cloudshelf_types';
import DependencyType from '@/dependency-injection/DependencyType';
import { inject, injectable } from 'inversify';

export interface CsOrder {
    __typename?: 'Order';
    id: any;
    thirdPartyId?: string | null;
    createdAt: any;
    updatedAt: any;
    status: OrderStatus;
    lines: Array<{
        __typename?: 'OrderLine';
        id: any;
        platformProvidedId?: any;
        platformProvidedProductId?: any;
        platformProvidedProductVariantId?: any;
        productId: string;
        productName: string;
        productVariantId: string;
        productVariantName: string;
        quantity: number;
        price: number;
        currencyCode: CurrencyCode;
    }>;
}

@injectable()
export class OrdersService {
    constructor(
        @inject(DependencyType.ApolloClient) private readonly apolloClient: ApolloClient<NormalizedCacheObject>,
    ) {}

    async getOne(orderId: string): Promise<CsOrder | null> {
        const variables: GetOrderQueryVariables = {
            orderId: orderId,
        };

        const { data, errors } = await this.apolloClient.query<GetOrderQuery, GetOrderQueryVariables>({
            fetchPolicy: 'no-cache',
            query: GetOrderDocument,
            variables,
            context: {
                debounceKey: 'getOrder',
            },
        });

        if (!data.order || errors) {
            console.error('Error fetching order', errors);
            throw new Error('Error fetching order');
        }

        return data.order ?? null;
    }

    async markAsPaid(orderId: string): Promise<boolean> {
        const variables: UpsertOrdersMutationVariables = {
            input: [
                {
                    id: orderId,
                    status: OrderStatus.Paid,
                },
            ],
        };

        const { data, errors } = await this.apolloClient.mutate<UpsertOrdersMutation, UpsertOrdersMutationVariables>({
            fetchPolicy: 'no-cache',
            mutation: UpsertOrdersDocument,
            variables,
        });

        if (!data?.upsertOrders || errors || data.upsertOrders.userErrors.length > 0) {
            console.error('Error marking order as paid', errors);
        }

        return (data?.upsertOrders?.orders ?? []).length > 0;
    }
}
