import { AttendanceSummary } from '@/types/hrms';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';

interface AttendanceSummaryTableProps {
  data: AttendanceSummary[];
}

export function AttendanceSummaryTable({ data }: AttendanceSummaryTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card animate-slide-up">
      <div className="border-b border-border px-6 py-4">
        <h3 className="text-lg font-semibold text-foreground">Attendance Overview</h3>
        <p className="text-sm text-muted-foreground">Monthly attendance summary by employee</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="font-semibold">Employee</TableHead>
            <TableHead className="font-semibold text-center">Present</TableHead>
            <TableHead className="font-semibold text-center">Absent</TableHead>
            <TableHead className="font-semibold text-center">Late</TableHead>
            <TableHead className="font-semibold">Attendance Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => {
            const attendanceRate = Math.round((record.presentDays / record.totalDays) * 100);
            return (
              <TableRow key={record.employeeId} className="hover:bg-muted/50">
                <TableCell className="font-medium">{record.employeeName}</TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center rounded-full bg-success/10 px-2.5 py-0.5 text-sm font-medium text-success">
                    {record.presentDays}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center rounded-full bg-destructive/10 px-2.5 py-0.5 text-sm font-medium text-destructive">
                    {record.absentDays}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center rounded-full bg-warning/10 px-2.5 py-0.5 text-sm font-medium text-warning">
                    {record.lateDays}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress value={attendanceRate} className="h-2 flex-1" />
                    <span className="text-sm font-medium text-muted-foreground w-12">{attendanceRate}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
