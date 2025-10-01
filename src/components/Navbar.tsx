
'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { RiMenu2Fill } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, fetchUser } from "@/redux/slices/userSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { clearBookings } from "@/redux/slices/bookingsSlice";

type TypeOfSettings = {
  name:string,
  logo:string
}

export default function Navbar() {

  const { user, loading: userLoading } = useSelector((state: RootState) => state.user);
  const loading = userLoading;
  const [menuOpen, setMenuOpen] = useState(false); 
  const role = userLoading ? null : user?.role;
  const [settings,setSettings] = useState<TypeOfSettings>()
  const router = useRouter();
  const pathname = usePathname();

  const dispatch = useDispatch<AppDispatch>();

  useEffect(()=> {
     axios.get("/api/admin/settings")
    .then(res=>{
      setSettings(res.data)
    })
  },[])

useEffect(() => {
  dispatch(fetchUser())
}, [dispatch]);


  const handleLogout = async () => {
    try {
      await axios.post("/api/logout");
          dispatch(clearUser()); 
          dispatch(clearBookings());
      toast.success("Logged out!");
      setMenuOpen(false);
      router.push("/");
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const NavLinks = () => (
  <>
    <li><Link href="/" onClick={() => setMenuOpen(false)} className={pathname === '/'?"underline font-semibold text-zinc-100":""}>Home</Link></li>

    {(role==="user") && (
      <li><Link href="/users/dashboard" onClick={() => setMenuOpen(false)} className={pathname === '/users/dashboard'?"underline font-semibold text-zinc-100":""}>Dashboard</Link></li>
    )}
     {(role==="admin") && (
      <li><Link href="/admin/dashboard" onClick={() => setMenuOpen(false)} className={pathname === '/admin/dashboard'?"underline font-semibold text-zinc-100":""}>Dashboard</Link></li>
    )}

    <li><Link href="/services" onClick={() => setMenuOpen(false)} className={pathname === '/services'?"underline font-semibold text-zinc-100":""}>Services</Link></li>
    <li><Link href="/products" onClick={() => setMenuOpen(false)} className={pathname === '/products'?"underline font-semibold text-zinc-100":""}>Products</Link></li>
    <li><Link href="/news" onClick={() => setMenuOpen(false)} className={pathname === '/news'?"underline font-semibold text-zinc-100":""}>News</Link></li>
    {role==="user"  &&
      (
      <li><Link href="/users/cart" onClick={() => setMenuOpen(false)} className={pathname === '/users/cart'?"underline font-semibold text-zinc-100":""}>Cart</Link></li>

      )}

    {(role==="user" || role===null) &&
    (<li><Link href="/contact" onClick={() => setMenuOpen(false)} className={pathname === '/contact'?"underline font-semibold text-zinc-100":""}>Contact</Link></li>)}

    {(role==="user" || role==="admin") ? (
      <li>
        <button onClick={handleLogout} className="hover:underline">Logout</button>
      </li>
    ) : (
      <>
        <li><Link href="/login" onClick={() => setMenuOpen(false)} className={pathname === '/login'?"underline font-semibold text-zinc-100":""}>Login</Link></li>
        <li><Link href="/register" onClick={() => setMenuOpen(false)} className={pathname === '/register'?"underline font-semibold text-zinc-100":""}>Sign Up</Link></li>
      </>
    )}
  </>
);



  return (
    <nav className="bg-green-700 h-13 text-white px-4 py-3 flex justify-between items-center relative">
      <h1 className="text-xl font-bold cursor-pointer"><Link href="/"> {loading ? (
      <div className="h-7 w-48 bg-zinc-300 rounded animate-pulse"></div>
    ) : (
      <>
        {settings?.logo && (
          <img src={settings.logo} alt="Logo" className="h-8 inline-block" />
        )}
        <h1 className="text-2xl">{settings?.name}</h1> 
      </>
    )}</Link></h1>

      {/* Desktop Nav */}
      <ul className="hidden md:flex gap-5 items-center">
       {!loading && <NavLinks />}

      </ul>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden text-2xl"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle Menu"
      >
        <RiMenu2Fill />
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <ul className="absolute top-12 right-0 bg-green-700 text-white  rounded-b shadow-xl shadow-green-300 p-4 flex flex-col gap-3 z-50 w-48 md:hidden">
          {!loading && <NavLinks />}
        </ul>
      )}
    </nav>
  );
}
