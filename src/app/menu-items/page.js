"use client";
import { useEffect, useState } from "react";
import UserTabs from "../../components/layout/UserTabs";
import { useProfile } from "../../components/useProfile";
import toast from "react-hot-toast";
import Link from "next/link";

export default function MenuItemsPage() { 
  const [menuItems, setMenuItems] = useState([]);
  
  useEffect(() => {
    fetch('/api/menu-items')
      .then(res => res.json())
      .then(data => {
        setMenuItems(data);
      })
      .catch(err => {
        toast.error("Failed to load menu items");
      });
  }, []);

  const { loading: profileLoading, data: profileData } = useProfile();

  if (profileLoading) {
    return "Loading User Info...";
  }

  if (profileData && !profileData.admin) {
    return "Not An Admin!";
  }

  return (
    <section className="mt-8 max-w-lg mx-auto">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Link className="button" href="/menu-items/new">Create new menu item</Link>
      </div>
      <div>
        <h2 className="text-sm mt-8 text-gray-500">Edit menu item:</h2>
        {menuItems?.length > 0 ? (
          menuItems.map(item => (
            <Link 
              key={item._id} // Adding key prop
              href={'/menu-items/edit/' + item._id} 
              className="button mb-1 block"
            >
              {item.name}
            </Link>
          ))
        ) : (
          <p>No menu items found.</p>
        )}
      </div>
    </section>
  ); 
}
