import { BasicProductInfo } from '@/services/ProductService';

export interface CartItemProps {
    basicInfo: BasicProductInfo;
    quantity: number;
    price: number;
}

const CartItem: React.FC<CartItemProps> = props => {
    return (
        <li className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0">
            <div className="shrink-0 relative">
                <span className="absolute top-1 left-1 flex h-6 w-6 items-center justify-center rounded-full border bg-white text-sm font-medium text-gray-500 shadow sm:-top-2 sm:-right-2">
                    {props.quantity}
                </span>
                <img className="h-24 w-24 max-w-full rounded-lg object-cover" src={props.basicInfo.image} alt="" />
            </div>

            <div className="relative flex flex-1 flex-col justify-between">
                <div className="sm:col-gap-5 sm:grid sm:grid-cols-2">
                    <div className="pr-8 sm:pr-5">
                        <p className="text-base font-semibold text-gray-900">{props.basicInfo.displayName}</p>
                        <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">{props.basicInfo.variantDisplayName}</p>
                    </div>

                    <div className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                        <p className="shrink-0 w-20 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">
                            {props.price.toFixed(2)} each
                        </p>
                    </div>
                </div>
            </div>
        </li>
    );
};

export default CartItem;
