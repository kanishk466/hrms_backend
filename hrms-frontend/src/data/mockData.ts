import { Employee, AttendanceRecord, AttendanceSummary, DashboardStats } from '@/types/hrms';

export const mockEmployees: Employee[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@company.com',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2022-03-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.chen@company.com',
    department: 'Design',
    position: 'UI/UX Designer',
    joinDate: '2021-08-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily.davis@company.com',
    department: 'Marketing',
    position: 'Marketing Manager',
    joinDate: '2020-11-10',
    status: 'active',
  },
  {
    id: '4',
    name: 'James Wilson',
    email: 'james.wilson@company.com',
    department: 'Engineering',
    position: 'DevOps Engineer',
    joinDate: '2023-01-05',
    status: 'active',
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@company.com',
    department: 'HR',
    position: 'HR Specialist',
    joinDate: '2022-06-18',
    status: 'inactive',
  },
];

export const mockAttendance: AttendanceRecord[] = [
  { id: '1', employeeId: '1', employeeName: 'Sarah Johnson', date: '2024-01-15', checkIn: '09:00', checkOut: '18:00', status: 'present' },
  { id: '2', employeeId: '2', employeeName: 'Michael Chen', date: '2024-01-15', checkIn: '09:15', checkOut: '18:30', status: 'late' },
  { id: '3', employeeId: '3', employeeName: 'Emily Davis', date: '2024-01-15', checkIn: '08:45', checkOut: '17:45', status: 'present' },
  { id: '4', employeeId: '4', employeeName: 'James Wilson', date: '2024-01-15', checkIn: null, checkOut: null, status: 'absent' },
  { id: '5', employeeId: '1', employeeName: 'Sarah Johnson', date: '2024-01-14', checkIn: '08:55', checkOut: '18:10', status: 'present' },
  { id: '6', employeeId: '2', employeeName: 'Michael Chen', date: '2024-01-14', checkIn: '09:00', checkOut: '18:00', status: 'present' },
  { id: '7', employeeId: '3', employeeName: 'Emily Davis', date: '2024-01-14', checkIn: '09:30', checkOut: '13:00', status: 'half-day' },
];

export const mockAttendanceSummary: AttendanceSummary[] = [
  { employeeId: '1', employeeName: 'Sarah Johnson', presentDays: 20, absentDays: 1, lateDays: 2, totalDays: 23 },
  { employeeId: '2', employeeName: 'Michael Chen', presentDays: 18, absentDays: 2, lateDays: 3, totalDays: 23 },
  { employeeId: '3', employeeName: 'Emily Davis', presentDays: 21, absentDays: 1, lateDays: 1, totalDays: 23 },
  { employeeId: '4', employeeName: 'James Wilson', presentDays: 19, absentDays: 3, lateDays: 1, totalDays: 23 },
  { employeeId: '5', employeeName: 'Lisa Anderson', presentDays: 15, absentDays: 5, lateDays: 3, totalDays: 23 },
];

export const mockDashboardStats: DashboardStats = {
  totalEmployees: 5,
  presentToday: 3,
  absentToday: 1,
  onLeave: 1,
};
