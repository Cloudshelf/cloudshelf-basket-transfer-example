const DependencyType = {
    ApolloClient: Symbol.for('ApolloClient'),
    ProductService: Symbol.for('ProductService'),
    OrdersService: Symbol.for('OrdersService'),
};

export default DependencyType;
