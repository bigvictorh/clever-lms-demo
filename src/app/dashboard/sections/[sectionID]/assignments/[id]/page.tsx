import { inter } from "@/app/ui/fonts"
import { CleverDataFetcher, fetchAssignmentById, fetchSectionByAssignmentId, fetchSections } from "@/app/lib/clever";
import { Suspense } from "react";
import { MySectionsSkeleton, AssignmentFields, AssignmentFieldsSkeleton } from "@/app/ui/skeletons";
import SubmissionsTable from "@/app/ui/submissions/submissions-list"



export default async function Page({ params }: {params: {id:string; sectionID:string;}}) {
    const id = params.id;
    const sectionID = params.sectionID;

    const fetcher = new CleverDataFetcher
    const assignmentData = await fetcher.getAssignment(sectionID, id);
    const submissionData = await fetcher.getSubmissions(sectionID, id);

    // Ensure the assignment data exists before using it
    if (!assignmentData) {
      return <div>Error: Could not fetch assignment data.</div>;
    }

    const fieldData = [
      { name: 'Assignment Title', value: assignmentData.title || 'N/A' },
      { name: 'Description', value: assignmentData.description || 'N/A' },
      { name: 'Due Date', value: assignmentData.due_date ? new Date(assignmentData.due_date).toLocaleString() : 'N/A' },
      { name: 'Points Possible', value: assignmentData.points_possible || 'N/A' },
      { name: 'Assignee Mode', value: assignmentData.assignee_mode || 'N/A' },
    ];

    return (
      <main>
      <h1 className={`${inter.className} mb-4 text-xl md:text-4xl`}>
        Assignment
      </h1>
        <div className="p-6">
          <h1 className="text-lg font mb-4">Details</h1>
          <Suspense fallback={<AssignmentFieldsSkeleton />}>
            <AssignmentFields fields={fieldData} />
          </Suspense>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
          <Suspense fallback={<MySectionsSkeleton />}>
            <SubmissionsTable submissionData={submissionData} section_id={sectionID} assignment_id={id} />
          </Suspense>
        </div>
    </main>
    );
}