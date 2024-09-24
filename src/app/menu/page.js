"use client";
import SectionHeaders from "../../components/layout/SectionHeader";
import MenuItem from "../../components/menu/MenuItem";
import { useState, useEffect } from "react";

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        if (isMounted) setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    const fetchMenuItems = async () => {
      try {
        const res = await fetch("/api/menu-items");
        if (!res.ok) throw new Error("Failed to fetch menu items");
        const data = await res.json();
        if (isMounted) setMenuItems(data);
      } catch (error) {
        console.error("Error fetching menu items:", error);
      }
    };

    fetchCategories();
    fetchMenuItems();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="mt-8">
      {categories.length > 0 &&
        categories.map((c) => (
          <div key={c._id}>
            <div className="text-center">
              <SectionHeaders mainHeader={c.name} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
              {menuItems
                .filter((item) => item.category === c._id)
                .map((item) => (
                  <MenuItem key={item._id} {...item} />
                ))}
            </div>
          </div>
        ))}
    </section>
  );
}
