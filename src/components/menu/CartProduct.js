import Image from "next/image";
import { CartContext, cartProductPrice } from "../../components/AppContext";
import { useContext } from "react";

export default function CartProduct({ product, onRemove }) {
  const { cartProducts, removeCartProduct } = useContext(CartContext);

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="w-24">
        <Image src={"/pizza.png"} alt="lyo" width={250} height={250} />
      </div>
      <div className="grow">
        <h3 className="font-semibold">{product.name}</h3>
        {product.size && (
          <div className="text-sm text-gray-700">
            Size: <span>{product.size.name}</span>
          </div>
        )}
        {product.extras?.length > 0 && (
          <div className="text-sm text-gray-500">
            {product.extras.map((extra) => (
              <div key={extra.name}>
                {extra.name} - ${extra.price}
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="text-lg font-semibold">
        ${cartProductPrice(product)}
      </div>
      {!!onRemove && (
        <div className="ml-2">
          <button
            type="button"
            onClick={() => onRemove(product.id)} // Use product.id to remove the product
            className="p-2"
          >
            Remove
          </button>
        </div>
      )}
    </div>
  );
}
