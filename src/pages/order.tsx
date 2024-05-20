import { OrderStatus } from '@/graphql/cloudshelf/generated/cloudshelf_types';
import { useInjection } from '@/dependency-injection/DependencyContext';
import DependencyType from '@/dependency-injection/DependencyType';
import { CsOrder, OrdersService } from '@/services/OrdersService';
import { ProductService } from '@/services/ProductService';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [loadedState, setLoadedState] = useState<'loading' | 'loaded' | 'error'>('loading');
    const [order, setOrder] = useState<CsOrder | null>(null);
    const orderService = useInjection<OrdersService>(DependencyType.OrdersService);
    const productService = useInjection<ProductService>(DependencyType.ProductService);

    useEffect(() => {
        if (router.isReady) {
            const orderIdFromQuery = router.query['order_id'];

            console.log('orderIdFromQuery', orderIdFromQuery);
            if (orderIdFromQuery === undefined) {
                setErrorMessage('No Order ID provided');
                setLoadedState('error');
                return;
            }

            if (Array.isArray(orderIdFromQuery)) {
                setErrorMessage('Only one Order ID must be provided');
                setLoadedState('error');
                return;
            }

            //Cloudshelf always sends the OrderID as a base64 encoded string, so we must decode it.
            let orderId: string | null = null;

            try {
                orderId = atob(orderIdFromQuery as string);
            } catch (err) {
                setErrorMessage('Order Id Encoding Error');
                setLoadedState('error');
            }
            //Cloudshelf always sends the OrderID as a base64 encoded string, so we must decode it.

            if (orderId === null) {
                setErrorMessage('Order Id Encoding Error');
                setLoadedState('error');
                return;
            }

            orderService
                .getOne(orderId)
                .then(order => {
                    setOrder(order);
                    setLoadedState('loaded');
                })
                .catch(err => {
                    setErrorMessage('Error fetching order');
                    setLoadedState('error');
                });
        }
    }, [router]);

    const handleMarkAsPaid = () => {
        if (!order) {
            return;
        }
        orderService
            .markAsPaid(order.id)
            .then(success => {
                if (success) {
                    setOrder({
                        ...order,
                        status: OrderStatus.Paid,
                    });
                }
            })
            .catch(err => {
                setErrorMessage('Error marking order as paid');
                setLoadedState('error');
            });
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center space-y-4">
                {loadedState === 'loading' && <p>Loading...</p>}
                {loadedState === 'error' && <p className="text-red-500">{errorMessage}</p>}
                {loadedState === 'loaded' && order && (
                    <>
                        <p>Order Loaded!</p>
                        <p>Current Status: {order?.status}</p>
                        <p>Number Items: {order?.lines.length}</p>

                        <hr />
                        <ul>
                            {order.lines.map(line => (
                                <li key={line.id}>
                                    {line.quantity} x {line.productName} ({line.productVariantName}) @ {line.price}{' '}
                                    {line.currencyCode} each
                                </li>
                            ))}
                        </ul>
                        {order.status !== OrderStatus.Paid && (
                            <div className="flex space-x-4">
                                <button
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                    onClick={handleMarkAsPaid}
                                >
                                    Mark as Paid!
                                </button>
                            </div>
                        )}
                        {/*Here you can get fancy and render something better looking, ive included an example CartItem here*/}
                        {/*<ul className="-my-8">*/}
                        {/*    {order?.lines.map(line => (*/}
                        {/*        <CartItem*/}
                        {/*            key={line.id}*/}
                        {/*            basicInfo={productService.getProductInfo(line.productVariantId)}*/}
                        {/*            quantity={line.quantity}*/}
                        {/*            price={line.price}*/}
                        {/*        />*/}
                        {/*    ))}*/}
                        {/*</ul>*/}
                    </>
                )}
            </div>
        </div>
    );
}
