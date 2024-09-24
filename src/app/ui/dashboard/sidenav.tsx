"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import VegaLogo from '@/app/ui/vega-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation'; // Make sure you use 'next/navigation' with the App Router

export default function SideNav() {
  const [userName, setUserName] = useState<string | null>(null);
  const router = useRouter(); // Use useRouter to handle client-side routing

  useEffect(() => {
    // Fetch user information from the API
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUserName(data.user.name);
        } else {
          console.warn("Failed to fetch user info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    try {
      // Call the API to terminate the session
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear the session token cookie client-side
        document.cookie = 'session_token=; Max-Age=0; path=/';
        console.log("session terminated")
        // Redirect to the login page using client-side routing
        router.push('/');
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-gray md:w-40">
          <VegaLogo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block">
          <div className="p-4 text-sm font-medium text-gray-600">
            {userName ? `Hello, ${userName}` : 'Loading...'}
          </div>
        </div>
        <button
          className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm text-black font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3"
          onClick={handleSignOut}
        >
          <PowerIcon className="w-6" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
