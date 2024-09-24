"use client";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfoBox from "../../components/layout/InfoBox";
import UserForm from "../../components/layout/UserForm";
import SuccessBox from "../../components/layout/SuccessBox";
import Link from "next/link";
import UserTabs from "../../components/layout/UserTabs";

export default function ProfilePage() {
  const session = useSession();
  const [user,setUser] = useState(null);
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const { status } = session;
  console.log(session);
  useEffect(() => {
    if (status === "authenticated") {
      // setUserName(session?.data?.user?.name);
      fetch("/api/profile").then((response) => {
        response.json().then((data) => {
          setUser(data);
          setIsAdmin(data.admin);
          setProfileFetched(true);
        });
      });
    }
  }, [session, status]);
  const handleProfileInfoUpdate = async (e,data) => {
    e.preventDefault();
    setSaved(false);
    setIsSaving(true);
    const response = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setIsSaving(false);
    if (response.ok) {
      setSaved(true);
    }
  };
  if (status === "loading" || !profileFetched) {
    return "loading..."; 
  }

  if (status === "unauthenticated") {
    return redirect("/login");
  }
  return (
    <section className="mt-8">
      <UserTabs isAdmin={isAdmin} />
      <div className="block max-w-xl mx-auto mt-8">
        {saved && <SuccessBox>Profile Saved!</SuccessBox>}
        {isSaving && <InfoBox>Saving...</InfoBox>}
        <UserForm user={user} onSave={handleProfileInfoUpdate}/>
      </div>
    </section>
  );
}
