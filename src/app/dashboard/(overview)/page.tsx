import { inter } from '@/app/ui/fonts';
import MySections from '@/app/ui/dashboard/my-sections';
import MyStudents from '@/app/ui/dashboard/my-students'
//import CardWrapper from '@/app/ui/dashboard/cards';
//import Card from '@/app/ui/dashboard/cards';
import { Suspense } from 'react';
import { SectionSkeleton, CardsSkeleton, MySectionsSkeleton, MyStudentsSkeleton } from '@/app/ui/skeletons';
import { cookies } from 'next/headers'; // To access the cookies
import { verifySessionToken } from '@/app/lib/session';
import { JwtPayload } from 'jsonwebtoken'; 
// import { getUserFromToken } from '@/app/api/user'; // Assuming you have this function

function getUserFromToken(token: string) {
  try {
    const decoded = verifySessionToken(token);

    if (typeof decoded !== 'string' && (decoded as JwtPayload).id) {
      return {
        id: (decoded as JwtPayload).id,
        name: (decoded as JwtPayload).name,
        email: (decoded as JwtPayload).email,
      };
    }
    return null;
  } catch (error) {
    return null;
  }
}

export default async function Home() {
    // Fetch the session token from cookies
    const cookieStore = cookies();
    const sessionToken = cookieStore.get('session_token')?.value;
    let user = null;

    if (sessionToken) {
      // Decode the token to get the user info
      user = getUserFromToken(sessionToken);
    }
  
    return( 
    <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-4xl`}>
      {user && <span>{user.name}'s Dashboard</span>}
      </h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
  
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
      <Suspense fallback={<MySectionsSkeleton />}>
        <MySections />
        </Suspense>


        <Suspense fallback={<MyStudentsSkeleton/>}>
        <MyStudents/>
        </Suspense>


      </div>
    </main>
  );

}