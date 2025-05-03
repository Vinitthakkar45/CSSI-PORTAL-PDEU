import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/Admin/Table';

const SkeletonRow = () => (
  <TableRow>
    {[...Array(6)].map((_, i) => (
      <TableCell key={i} className="py-3 px-4">
        <div className="h-4 bg-gray-200 rounded dark:bg-gray-700 w-full animate-pulse"></div>
      </TableCell>
    ))}
  </TableRow>
);

const CoordinatorTableSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Coordinator Details</h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader>No</TableCell>
              <TableCell isHeader>Name</TableCell>
              <TableCell isHeader>Email</TableCell>
              <TableCell isHeader>Department</TableCell>
              <TableCell isHeader>Sitting Location</TableCell>
              <TableCell isHeader>Available Time Slots</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CoordinatorTableSkeleton;
