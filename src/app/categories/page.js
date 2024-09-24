"use client";
import { useEffect, useState } from "react";
import { useProfile } from "../../components/useProfile";
import toast from "react-hot-toast";
import UserTabs from "../../components/layout/UserTabs";
import DeleteButton from "../../components/DeleteButton";

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const {loading:profileLoading, data:profileData} = useProfile();
  const [editedCategory, setEditedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();
    try {
      const data = { name: categoryName };
      if (editedCategory) {
        data._id = editedCategory._id;
      }
      
      const response = await fetch('/api/categories', {
        method: editedCategory ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error occurred');
      }
  
      await toast.promise(
        Promise.resolve(),
        {
          loading: editedCategory ? 'Updating category...' : 'Creating your new category...',
          success: editedCategory ? 'Category updated' : 'Category created',
          error: 'Error, sorry...',
        }
      );
  
      setCategoryName('');
      setEditedCategory(null);
      fetchCategories(); // Fetch categories after success
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    }
  }
  
  async function handleDeleteClick(_id) {
    try {
      const response = await toast.promise(
        fetch(`/api/categories/?_id=${_id}`, {
          method: 'DELETE',
        }), 
        {
          loading: 'Deleting...',
          success: 'Deleted successfully',
          error: 'Failed to delete, please try again.',
        }
      );
  
      if (response.ok) {
        fetchCategories(); // Refresh the categories after deletion
      } else {
        console.error("Failed to delete the category");
      }
    } catch (error) {
      console.error("Error deleting the category:", error);
    }
  }
  

  if (profileLoading) {
    return 'Loading user info...';
  }

  if (!profileData.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 max-w-2xl mx-auto">
      <UserTabs isAdmin={true} />
      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? 'Update category' : 'New category name'}
              {editedCategory && (
                <>: <b>{editedCategory.name}</b></>
              )}
            </label>
            <input type="text"
                   value={categoryName}
                   onChange={ev => setCategoryName(ev.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="border border-primary" type="submit">
              {editedCategory ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName('');
              }}>
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing categories</h2>
        {categories?.length > 0 && categories.map(c => (
          <div
            key={c._id}
            className="bg-gray-100 rounded-xl p-2 px-4 flex gap-1 mb-1 items-center">
            <div className="grow">
              {c.name}
            </div>
            <div className="flex gap-1">
              <button type="button"
                      onClick={() => {
                        setEditedCategory(c);
                        setCategoryName(c.name);
                      }}
              >
                Edit
              </button>
              <DeleteButton
                label="Delete"
                onDelete={() => handleDeleteClick(c._id)} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}