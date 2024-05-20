import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Home() {
    const router = useRouter();
    const [orderId, setOrderId] = useState<string>('');

    const handleOnClickFindOrder = () => {
        const orderIdBase64 = btoa(orderId);
        void router.push(`/order?order_id=${orderIdBase64}`);
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen">
            <div className="flex flex-col items-center space-y-4">
                <input
                    type="text"
                    placeholder="Enter Order ID"
                    className="w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    value={orderId}
                    onChange={e => setOrderId(e.target.value)}
                />

                <div className="flex space-x-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={handleOnClickFindOrder}
                    >
                        Find Order
                    </button>
                </div>
                <p>OR navigate to /order?order_id=[id_here] where the ID is base64 encoded.</p>
            </div>
        </div>
    );
}
