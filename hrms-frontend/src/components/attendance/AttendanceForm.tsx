import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Employee, AttendanceRecord } from '@/types/hrms';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const attendanceSchema = z.object({
  employeeId: z.string().min(1, 'Please select an employee'),
  status: z.enum(['present', 'absent', 'late', 'half-day']),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceFormProps {
  employees: Employee[];
  existingRecords: AttendanceRecord[];
  onSubmit: (data: AttendanceFormData & { date: string }) => void;
}

export function AttendanceForm({ employees, existingRecords, onSubmit }: AttendanceFormProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // console.log('Rendering AttendanceForm with employees:', employees);

  const {
    setValue,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      employeeId: '',
      status: 'present',
    },
  });

  const selectedEmployeeId = watch('employeeId');
  
  // Check if attendance already exists for selected employee and date
  const hasExistingRecord = existingRecords.some(
    (record) => record.employeeId === selectedEmployeeId && record.date === format(date, 'yyyy-MM-dd')
  );

  const handleFormSubmit = async (data: AttendanceFormData) => {
    if (hasExistingRecord) return;
    
    setIsSubmitting(true);
    await onSubmit({ ...data, date: format(date, 'yyyy-MM-dd') });
    setIsSubmitting(false);
    reset();
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Log Attendance</h3>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !date && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Employee</Label>
            <Select
              value={watch('employeeId')}
              onValueChange={(value) => setValue('employeeId', value)}
            >
              <SelectTrigger className={errors.employeeId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.filter(e => e.status === 'active').map((employee) => (
                  <SelectItem key={employee.employeeId} value={employee.employeeId}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.employeeId && (
              <p className="text-sm text-destructive">{errors.employeeId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select
              value={watch('status')}
              onValueChange={(value: 'present' | 'absent' | 'late' | 'half-day') => setValue('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
                <SelectItem value="half-day">Half Day</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasExistingRecord && (
          <p className="text-sm text-warning">
            Attendance already logged for this employee on this date.
          </p>
        )}

        <Button 
          type="submit" 
          disabled={isSubmitting || hasExistingRecord}
          className="w-full sm:w-auto"
        >
          {isSubmitting ? 'Logging...' : 'Log Attendance'}
        </Button>
      </form>
    </div>
  );
}
