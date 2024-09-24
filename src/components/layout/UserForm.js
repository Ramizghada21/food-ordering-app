"use client";
import { useState } from "react";
import { useProfile } from "../useProfile";
import AddressInputs from "./AddressInputs";
export default function UserForm({ user, onSave }) {
  const [userName, setUserName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [streetAddress, setStreetAddress] = useState(user?.streetAddress || "");
  const [postalCode, setPostalCode] = useState(user?.postalCode || "");
  const [city, setCity] = useState(user?.city || "");
  const [country, setCountry] = useState(user?.country || "");
  const [isAdmin, setIsAdmin] = useState(user?.admin || false);
  const { data: loggedInUserData } = useProfile();

  function handleAddressChange(propName,value)
  {
    if(propName === 'phone') setPhone(value);
    if(propName === 'streetAddress') setStreetAddress(value);
    if(propName === 'postalCode') setPostalCode(value);
    if(propName === 'city') setCity(value);
    if(propName === 'country') setCountry(value);
  }
  return (
    <div className="flex gap-4 items-center">
      <form
        className="grow"
        onSubmit={(e) =>
          onSave(e, {
            name: userName,
            phone,
            admin: isAdmin,  // Make sure to pass the correct isAdmin value
            streetAddress,
            postalCode,
            city,
            country,
          })
        }
      >
        <label>First Name & Last Name</label>
        <input
          type="text"
          value={userName}
          placeholder="First and Last Name"
          onChange={(e) => setUserName(e.target.value)}
        />
        <label>Email</label>
        <input type="email" disabled={true} value={user?.email} placeholder="email" />
        <AddressInputs 
        addressProps={{phone,streetAddress,postalCode,city,country}}
        setAddressProp={handleAddressChange}
        />
        {loggedInUserData?.admin && (
          <div>
            <label
              htmlFor="adminCb"
              className="p-2 inline-flex items-center gap-2 mb-2"
            >
              <input
                id="adminCb"
                type="checkbox"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)} // Use onChange event
              />
              <span>Admin</span>
            </label>
          </div>
        )}
        <button type="submit">Save</button>
      </form>
    </div>
  );
}
