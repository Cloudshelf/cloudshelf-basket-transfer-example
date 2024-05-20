import { initializeCloudshelfApollo } from '@/graphql/ApolloClientFactory';
import DependencyType from '@/dependency-injection/DependencyType';
import { OrdersService } from '@/services/OrdersService';
import { ProductService } from '@/services/ProductService';
import { Container } from 'inversify';

const dependencyContainer = new Container();

dependencyContainer.bind(DependencyType.ApolloClient).toConstantValue(initializeCloudshelfApollo(null, null));

dependencyContainer.bind<OrdersService>(DependencyType.OrdersService).to(OrdersService).inSingletonScope();

dependencyContainer.bind<ProductService>(DependencyType.ProductService).to(ProductService).inSingletonScope();

export default dependencyContainer;
