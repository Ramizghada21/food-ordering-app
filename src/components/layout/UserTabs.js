import Link from "next/link";
import { usePathname } from "next/navigation";
export default function UserTabs({isAdmin}) {
    const path = usePathname();
  return (
    <div className="flex mx-auto gap-2 tabs justify-center flex-wrap">
      <Link className={path === '/profile' ? 'active' : ''} href={"/profile"}>
        Profile
      </Link>
      {isAdmin && (
        <>
          <Link className={path === '/categories' ? 'active' : ''} href={"/categories"}>Categories</Link>
          <Link className={/menu-items/.test(path) ? 'active' : ''} href={"/menu-items"}>Menu-Items</Link>
          <Link className={path.includes('/users') ? 'active' : ''} href={"/users"}>Users</Link>
          {/* <Link className={path === '/orders' ? 'active' : ''} href={"/orders"}>Orders</Link> */}
        </>
      )}
      <Link className={path === '/orders' ? 'active' : ''} href={"/orders"}>Orders</Link>
    </div>
  );
}
