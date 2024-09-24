"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import UserTabs from "../../components/layout/UserTabs";
import { useProfile } from "../../components/useProfile";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const { loading: profileLoading, data: profileData } = useProfile();

  useEffect(() => {
    if (profileData?.admin) {
      fetch("/api/users")
        .then((res) => res.json())
        .then((users) => setUsers(users))
        .catch((error) => {
          console.error("Failed to fetch users:", error);
        });
    }
  }, [profileData]);

  if (profileLoading) {
    return "Loading User Info...";
  }

  if (profileData && !profileData.admin) {
    return "Not An Admin!";
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
    <UserTabs isAdmin={true} />
    <div className="mt-8">
      {users?.length > 0 && users.map(user => (
        <div
          key={user._id}
          className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
            <div className="text-gray-900">
              {!!user.name && (<span>{user.name}</span>)}
              {!user.name && (<span className="italic">No name</span>)}
            </div>
            <span className="text-gray-500">{user.email}</span>
          </div>
          <div>
            <Link className="button" href={'/users/'+user._id}>
              Edit
            </Link>
          </div>
        </div>
      ))}
    </div>
  </section>
  );
}
