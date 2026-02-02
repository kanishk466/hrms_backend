import { useState, useMemo, useEffect } from 'react';
import { format } from 'date-fns';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { AttendanceForm } from '@/components/attendance/AttendanceForm';
import { AttendanceTable } from '@/components/attendance/AttendanceTable';
import { DateFilter } from '@/components/attendance/DateFilter';
import { mockEmployees } from '@/data/mockData';
import { AttendanceRecord , Employee} from '@/types/hrms';

import { useToast } from '@/hooks/use-toast';
import { createAttendance, getAttendance, AttendancePayload } from '@/services/attendanceService';

export default function Attendance() {
  const [date, setDate] = useState<Date>(new Date());
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Fetch attendance records for the selected date
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        setLoading(true);
        setError(null);
        const dateStr = format(date, 'yyyy-MM-dd');
        const data = await getAttendance(dateStr);
        
        // Transform API response to component format
        const transformedRecords: AttendanceRecord[] = data.map((record, index) => ({
          id: record._id || String(index),
          employeeId: record.employeeId,
          employeeName: mockEmployees.find((e) => e.id === record.employeeId)?.name || record.employeeId,
          date: record.date,
          checkIn: null,
          checkOut: null,
          status: record.status.toLowerCase() as AttendanceRecord['status'],
        }));
        
        setRecords(transformedRecords);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch attendance records';
        setError(message);
        toast({
          title: 'Error',
          description: message,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [date, toast]);



    useEffect(() => {
      setLoading(true);
      fetch('https://hrms-backend-n8nc.onrender.com/api/employees')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch employees');
          return res.json();
        })
        .then((list: any[]) => {
          const mapped = list.map((item) => ({
            id: item._id || item.employeeId || String(Date.now()),
            name: item.fullName || item.name || '',
            email: item.email || '',
            department: item.department || '',
            employeeId: item.employeeId || '',
            joinDate: item.joinDate || new Date().toISOString().split('T')[0],
            status: item.status || 'active',
          })) as Employee[];
          setEmployees(mapped);
        })
        .catch(() => {
          toast({
            title: 'Error',
            description: 'Failed to load employees.',
            variant: 'destructive',
          });
        })
        .finally(() => setLoading(false));
    }, []);

  const filteredRecords = useMemo(() => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return records.filter((record) => record.date === dateStr);
  }, [records, date]);

  const handleSubmit = async (data: { employeeId: string; status: AttendanceRecord['status']; date: string }) => {
   
  //  console.log('Submitting attendance:', data);

    const employee = employees.find((e) => e.employeeId === data.employeeId);
    if (!employee) return;

    try {
      // Map component status to API status format
      const statusMap: Record<AttendanceRecord['status'], AttendancePayload['status']> = {
        'present': 'PRESENT',
        'absent': 'ABSENT',
        'late': 'LATE',
        'half-day': 'HALF-DAY',
      };

      await createAttendance({
        employeeId: data.employeeId,
        date: data.date,
        status: statusMap[data.status],
      });

      // Refresh records for current date
      const dateStr = format(date, 'yyyy-MM-dd');
      if (data.date === dateStr) {
        const updatedData = await getAttendance(dateStr);
        const transformedRecords: AttendanceRecord[] = updatedData.map((record, index) => ({
          id: record._id || String(index),
          employeeId: record.employeeId,
          employeeName: mockEmployees.find((e) => e.id === record.employeeId)?.name || record.employeeId,
          date: record.date,
          checkIn: null,
          checkOut: null,
          status: record.status.toLowerCase() as AttendanceRecord['status'],
        }));
        setRecords(transformedRecords);
      }

      toast({
        title: 'Attendance logged',
        description: `${employee.name} marked as ${data.status} for ${data.date}.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to log attendance';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    }
  };

  // Calculate summary stats for the selected date
  const summary = useMemo(() => {
    const present = filteredRecords.filter((r) => r.status === 'present').length;
    const absent = filteredRecords.filter((r) => r.status === 'absent').length;
    const late = filteredRecords.filter((r) => r.status === 'late').length;
    return { present, absent, late, total: filteredRecords.length };
  }, [filteredRecords]);

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Attendance"
          description="Track daily attendance and manage records"
        />

        <AttendanceForm
          employees={employees}
          existingRecords={records}
          onSubmit={handleSubmit}
        />

        {error && (
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <DateFilter date={date} onDateChange={setDate} />
          
          {!loading && (
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                Present: {summary.present}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                Absent: {summary.absent}
              </span>
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-warning" />
                Late: {summary.late}
              </span>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading attendance records...</div>
        ) : (
          <AttendanceTable records={filteredRecords} />
        )}
      </div>
    </MainLayout>
  );
}
