import { AttendanceRecord } from '@/types/hrms';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AttendanceTableProps {
  records: AttendanceRecord[];
}

const statusStyles = {
  present: 'bg-success/10 text-success',
  absent: 'bg-destructive/10 text-destructive',
  late: 'bg-warning/10 text-warning',
  'half-day': 'bg-accent/10 text-accent',
};

export function AttendanceTable({ records }: AttendanceTableProps) {
  if (records.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-12 text-center shadow-card">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-foreground">No attendance records</h3>
        <p className="mt-2 text-sm text-muted-foreground">No attendance data for the selected date.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-card overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent bg-muted/30">
            <TableHead className="font-semibold">Employee</TableHead>
            <TableHead className="font-semibold">Date</TableHead>
            <TableHead className="font-semibold">Check In</TableHead>
            <TableHead className="font-semibold">Check Out</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.map((record) => (
            <TableRow key={record.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                    <span className="text-sm font-medium text-primary">
                      {record.employeeName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="font-medium text-foreground">{record.employeeName}</span>
                </div>
              </TableCell>
              <TableCell className="text-muted-foreground">{record.date}</TableCell>
              <TableCell>{record.checkIn || '—'}</TableCell>
              <TableCell>{record.checkOut || '—'}</TableCell>
              <TableCell>
                <Badge className={cn('capitalize', statusStyles[record.status])}>
                  {record.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
