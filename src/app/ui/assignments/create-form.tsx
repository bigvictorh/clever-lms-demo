// Create Assignments Form

'use client';

import { useFormState } from 'react-dom';
import { useState } from 'react'; // Import useState for managing state
import Link from 'next/link';
import { CalendarDaysIcon } from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createAssignment } from '@/app/lib/actions';

export default function Form({ section_id }: { section_id: string }) {
  const initialState = { message: null, errors: {} };
  const [state, dispatch] = useFormState(createAssignment.bind(null, section_id), initialState);
  
  const [assigneeMode, setAssigneeMode] = useState('all'); // Default to "all"

  const students = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Michael Johnson' }
  ];

  return (
    <form action={dispatch}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">

        {/* Assignment Title */}
        <div className="mb-4">
          <label htmlFor="title" className="mb-2 block text-sm font-medium">
            Assignment Title
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="title"
              name="title"
              type="text"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-400"
              placeholder="Enter assignment title"
              aria-describedby="title-error"
            />
            <div id="title-error" aria-live="polite" aria-atomic="true">
              {state.errors?.title &&
                state.errors.title.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Assignment Description */}
        <div className="mb-4">
          <label htmlFor="description" className="mb-2 block text-sm font-medium">
            Assignment Description
          </label>
          <div className="relative mt-2 rounded-md">
            <textarea
              id="description"
              name="description"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-400"
              placeholder="Enter assignment description"
              rows={4}
              aria-describedby="description-error"
            />
            <div id="description-error" aria-live="polite" aria-atomic="true">
              {state.errors?.description &&
                state.errors.description.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Due Date */}
        <div className="mb-4">
          <label htmlFor="dueDate" className="mb-2 block text-sm font-medium">
            Due Date
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="dueDate"
              name="dueDate"
              type="datetime-local"
              className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-400"
              aria-describedby="dueDate-error"
            />
            <CalendarDaysIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            <div id="dueDate-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dueDate &&
                state.errors.dueDate.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>

        {/* Points Possible
        <div className="mb-4">
          <label htmlFor="points" className="mb-2 block text-sm font-medium">
            Points Possible
          </label>
          <div className="relative mt-2 rounded-md">
            <input
              id="points"
              name="points"
              type="number"
              className="peer block w-full rounded-md border border-gray-200 py-2 px-3 text-sm outline-2 placeholder:text-gray-400"
              placeholder="Enter points possible"
              aria-describedby="points-error"
            />
            <div id="points-error" aria-live="polite" aria-atomic="true">
              {state.errors?.points_possible &&
                state.errors.points_possible.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>
        </div>  */}

        {/* Assignee Mode */}
        <div className="mb-4">
          <span className="mb-2 block text-sm font-medium">Assignee Mode</span>
          <div className="flex gap-4">
            <div className="flex items-center">
              <input
                id="assigneeAll"
                name="assigneeMode"
                type="radio"
                value="all"
                className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-2"
                checked={assigneeMode === 'all'}
                onChange={() => setAssigneeMode('all')}
                aria-describedby="assigneeMode-error"
              />
              <label htmlFor="assigneeAll" className="ml-2 text-sm font-medium">
                All
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="assigneeIndividual"
                name="assigneeMode"
                type="radio"
                value="individual"
                className="h-4 w-4 border-gray-300 text-gray-600 focus:ring-2"
                checked={assigneeMode === 'individual'}
                onChange={() => setAssigneeMode('individual')}
              />
              <label htmlFor="assigneeIndividual" className="ml-2 text-sm font-medium">
                Individual
              </label>
            </div>
          </div>
          <div id="assigneeMode-error" aria-live="polite" aria-atomic="true">
            {state.errors?.assigneeMode &&
              state.errors.assigneeMode.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </div>

        {/* Assignees (visible only if 'Individual' is selected)
        {assigneeMode === 'individual' && (
          <div className="mb-4">
            <label htmlFor="assignees" className="mb-2 block text-sm font-medium">
              Assignees
            </label>
            <div className="relative mt-2 rounded-md">
              <select
                id="assignees"
                name="assignees"
                className="block w-full rounded-md border border-gray-200 py-2 px-3 text-sm"
                multiple
                aria-describedby="assignees-error"
              >
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.name}
                  </option>
                ))}
              </select>
              <div id="assignees-error" aria-live="polite" aria-atomic="true">
                {state.errors?.assignees &&
                  state.errors.assignees.map((error: string) => (
                    <p className="mt-2 text-sm text-red-500" key={error}>
                      {error}
                    </p>
                  ))}
              </div>
            </div>
          </div>
        )}  */}
        
      </div>
      <div className="mt-6 flex justify-end gap-4">
        <Link
          href="/dashboard/assignments"
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </Link>
        <Button type="submit">Create Assignment</Button>
      </div>
    </form>
  );
}
