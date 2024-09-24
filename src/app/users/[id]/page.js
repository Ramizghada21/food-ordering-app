"use client";

import { useProfile } from "../../../components/useProfile";
import UserTabs from "../../../components/layout/UserTabs";
import UserForm from "../../../components/layout/UserForm";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function EditUserPage() {
    const [user, setUser] = useState(null);
    const { id } = useParams();

const { loading: profileLoading, data: profileData } = useProfile();
useEffect(() => {
    fetch('/api/profile?_id='+id).then(res => {
      res.json().then(user => {
        setUser(user);
      });
    })
  }, []);

  async function handleSaveButtonClick(ev, data) {
    ev.preventDefault();
    const promise = new Promise(async (resolve, reject) => {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({...data,_id:id}),
      });
      if (res.ok)
        resolve();
      else
        reject();
    });

    await toast.promise(promise, {
      loading: 'Saving user...',
      success: 'User saved',
      error: 'An error has occurred while saving the user',
    });
  }

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
                <UserForm user={user} onSave={handleSaveButtonClick} />
            </div>
        </section>
    );
}
