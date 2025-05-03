'use client';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Phone, Mail, Clock, User } from 'lucide-react';
import Image from 'next/image';

type Faculty = {
  id: number;
  userId: string;
  name: string;
  department: string;
  sitting: string;
  freeTimeSlots: string[];
  email: string;
  contactNumber: string;
  profileImage?: string;
};

export default function AssigneesPage() {
  const session = useSession();
  const [loading, setLoading] = useState(true);
  const [mentor, setMentor] = useState<Faculty | null>(null);
  const [evaluator, setEvaluator] = useState<Faculty | null>(null);
  const [coordinators, setCoordinators] = useState<Faculty[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignees = async () => {
      if (session.status === 'authenticated' && session.data?.user?.id) {
        try {
          const response = await fetch('/api/mentorandevaluator', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: session.data.user.id,
              role: 'student',
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch assignees');
          }

          const data = await response.json();
          setMentor(data.mentor);
          setEvaluator(data.evaluator);
          setCoordinators(data.coordinators || []);
        } catch (err) {
          console.error(err);
          setError('Failed to load assignees data');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchAssignees();
  }, [session]);

  if (session.status === 'loading' || loading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Assignees</h3>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div className="h-7 w-40 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="h-20 w-20 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                      <div className="h-5 w-32 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                      <div className="h-5 w-32 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                      <div className="h-5 w-32 bg-gray-200 rounded dark:bg-gray-700 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-md">
          <p className="text-red-700 dark:text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  const FacultyCard = ({ title, faculty }: { title: string; faculty: Faculty | null }) => {
    if (!faculty) return null;

    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03]">
        <div className="mb-5 flex items-center justify-between">
          <h4 className="text-base font-medium text-gray-800 dark:text-white/90">{title}</h4>
          <div className="flex items-center gap-2">
            {faculty.email && (
              <a
                href={`mailto:${faculty.email}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
            {faculty.contactNumber && (
              <a
                href={`tel:${faculty.contactNumber}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              >
                <Phone className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="relative h-20 w-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {faculty.profileImage ? (
              <Image src={faculty.profileImage} alt={faculty.name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-lg font-semibold text-gray-500 dark:text-gray-400">
                {faculty.name?.substring(0, 2).toUpperCase()}
              </span>
            )}
          </div>

          <div className="flex-1">
            <h3 className="mb-4 text-xl font-semibold text-gray-800 dark:text-white/90">{faculty.name}</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {faculty.department && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Department</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{faculty.department}</p>
                </div>
              )}

              {faculty.email && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{faculty.email}</p>
                </div>
              )}

              {faculty.contactNumber && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Contact</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{faculty.contactNumber}</p>
                </div>
              )}

              {faculty.sitting && (
                <div>
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">Seating</p>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{faculty.sitting}</p>
                </div>
              )}

              {faculty.freeTimeSlots && faculty.freeTimeSlots.length > 0 && (
                <div className="md:col-span-2">
                  <p className="mb-1 text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                    Available Time Slots
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {faculty.freeTimeSlots.map((slot, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      >
                        <Clock className="mr-1 h-3 w-3" />
                        {slot}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const NoAssigneesMessage = () => (
    <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-white/[0.03] text-center">
      <User className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
      <h4 className="mb-2 text-lg font-medium text-gray-800 dark:text-white/90">No Assignees Yet</h4>
      <p className="text-gray-500 dark:text-gray-400">
        Faculty members have not been assigned to you yet. Please check back later.
      </p>
    </div>
  );

  const hasAnyAssignees = mentor || evaluator || coordinators.length > 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
      <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">Assignees</h3>

      <div className="space-y-6">
        {hasAnyAssignees ? (
          <>
            {coordinators.map((coordinator, index) => (
              <FacultyCard
                key={coordinator.id}
                title={`Department Coordinator ${coordinators.length > 1 ? index + 1 : ''}`}
                faculty={coordinator}
              />
            ))}

            {mentor && <FacultyCard title="Internal Faculty (Mentor)" faculty={mentor} />}
            {evaluator && <FacultyCard title="External Evaluator" faculty={evaluator} />}
          </>
        ) : (
          <NoAssigneesMessage />
        )}
      </div>
    </div>
  );
}
