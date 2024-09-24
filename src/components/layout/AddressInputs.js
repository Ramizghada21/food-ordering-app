export default function AddressInputs({
  addressProps,
  setAddressProp,
  disabled = false,
}) {
  const { phone, streetAddress, postalCode, city, country } = addressProps;
  return (
    <>
      <label>Phone</label>
      <input
        disabled={disabled}
        type="tel"
        placeholder="Phone Number"
        value={phone || ''}
        onChange={(e) => setAddressProp("phone", e.target.value)}
      />
      <label>Street Address</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Street Address"
        value={streetAddress || ''}
        onChange={(e) => setAddressProp("streetAddress", e.target.value)}
      />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label>Postal Code</label>
          <input
            disabled={disabled}
            type="text"
            placeholder="Postal Code"
            value={postalCode || ''}
            onChange={(e) => setAddressProp("postalCode", e.target.value)}
          />
        </div>
        <div>
          <label>City</label>
          <input
            disabled={disabled}
            type="text"
            placeholder="City"
            value={city || ''}
            onChange={(e) => setAddressProp("city", e.target.value)}
          />
        </div>
      </div>
      <label>Country</label>
      <input
        disabled={disabled}
        type="text"
        placeholder="Country"
        value={country || ''}
        onChange={(e) => setAddressProp("country", e.target.value)}
      />
    </>
  );
}
