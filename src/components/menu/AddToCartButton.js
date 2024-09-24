export default function AddToCartButton({
    hashSizesOrExtras,onClick,basePrice,
})
{
    return(
        <button
          type="button"
          onClick={onClick}
          className="mt-4 bg-primary text-white rounded-full px-6 py-2"
        >
          {hashSizesOrExtras ? (
            <span>Add to cart(From ${basePrice})</span>
          ) : (
            <span>Add to cart ${basePrice}</span>
          )}

        </button>
    );
}