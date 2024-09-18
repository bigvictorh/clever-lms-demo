import Pagination from '@/app/ui/assignments/pagination';
import Search from '@/app/ui/search';
import Table from '@/app/ui/assignments/table';
import { CreateAssignment } from '@/app/ui/assignments/buttons';
import { inter } from '@/app/ui/fonts';
import { AssignmentsTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchAssignmentsPages } from '@/app/lib/clever';
import Breadcrumbs from '@/app/ui/assignments/breadcrumbs';

 
export default async function Page({
    searchParams, params
  }: {
    searchParams?: {
      query?: string;
      page?: string;
    },
    params: {sectionID: string};
  }) {
    `const query = searchParams?.query || '';`
    const query = params.sectionID || '';
    const currentPage = Number(searchParams?.page) || 1;
    const sectionID = params.sectionID;
    const totalPages = await fetchAssignmentsPages(query);
    
    return (
      <div className="w-full">
        <Breadcrumbs
          breadcrumbs={[
            { label: 'Sections', href: `/dashboard`},
            { label: 'Assignments', href: `/dashboard/sections/${sectionID}/assignments`, active: true },
          ]}
        />
        <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
          <Search placeholder="Search assignments..." />
          <CreateAssignment sectionID={params.sectionID}/>
        </div>
        <Suspense key={query + currentPage} fallback={<AssignmentsTableSkeleton />}>
          <Table query={query} currentPage={currentPage} />
        </Suspense>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    );
  }