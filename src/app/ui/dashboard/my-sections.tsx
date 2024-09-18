import { ArrowPathIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { inter } from '@/app/ui/fonts';
import { CleverDataFetcher } from '@/app/lib/clever';
import { headers } from 'next/headers'; // To access request headers in server components

export default async function fetchSectionData() {
  // Step 1: Check if we're on the server and construct the correct base URL
  const isServer = typeof window === 'undefined'; // Server-side check

  const headersList = headers(); // To access headers in a server component
  const host = headersList.get('host'); // Get the host from headers if running server-side
  const baseUrl = isServer ? `http://${host}` : ''; // Construct base URL dynamically
  const cookie = headersList.get('cookie'); // Get the cookies from the incoming request
  const fetchOptions: RequestInit = {
    headers: cookie ? { cookie } : undefined, // Only include cookie if it is not null
  };

  try {
    // Step 2: Fetch the session data
    const sessionResponse = await fetch(`${baseUrl}/api/user`, fetchOptions); // Absolute URL on the server, relative on the client
    if (!sessionResponse.ok) {
      throw new Error('Failed to fetch user session');
    }

    const session = await sessionResponse.json(); // Parse the session data
    console.log('session:' +session);
    const user = session?.user;
    console.log(user);

    if (!user || !user.id) {
      console.log('Invalid session or no user ID found');
      return <p>No valid user session found.</p>;
    }

    // Step 3: Fetch sections data using the CleverDataFetcher
    const fetcher = new CleverDataFetcher();
    const sectionData = await fetcher.fetchSections(user.id); // Pass the user's ID to fetch sections

    // Step 4: Render the fetched data in the component
    return (
      <div className="flex w-full flex-col md:col-span-4">
        <h2 className={`${inter.className} mb-4 text-xl md:text-2xl`}>
          My Sections
        </h2>
        <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
          {sectionData.length > 0 ? (
            <div className="bg-white px-6">
              {sectionData.map((section: any, i: any) => (
                <div
                  key={section.id}
                  className={clsx('flex flex-row items-center justify-between py-4', {
                    'border-t': i !== 0,
                  })}
                >
                  <div className="flex items-center">
                    <div className="min-w-0">
                      <Link
                        href={`/dashboard/sections/${section.id}/assignments`}
                        className="truncate text-lg text-gray-700 font-semibold sm:block"
                      >
                        {section.name}
                      </Link>
                      <p className="text-sm text-gray-400 font-normal md:text-base">{section.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No sections available.</p>
          )}
          <div className="flex items-center pb-2 pt-6">
            <ArrowPathIcon className="h-5 w-5 text-gray-500" />
            <h3 className="ml-2 text-sm text-gray-500">Updated just now</h3>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching sections:', error);
    return <p>Failed to load sections.</p>;
  }
}
