import { Users, UserCheck, UserX, CalendarOff } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceSummaryTable } from '@/components/dashboard/AttendanceSummaryTable';
import { mockDashboardStats, mockAttendanceSummary } from '@/data/mockData';

export default function Dashboard() {
  const stats = mockDashboardStats;
  const summary = mockAttendanceSummary;

  return (
    <MainLayout>
      <div className="space-y-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your workforce and attendance metrics"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            variant="primary"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Present Today"
            value={stats.presentToday}
            icon={UserCheck}
            variant="success"
          />
          <StatCard
            title="Absent Today"
            value={stats.absentToday}
            icon={UserX}
            variant="warning"
          />
          <StatCard
            title="On Leave"
            value={stats.onLeave}
            icon={CalendarOff}
            variant="accent"
          />
        </div>

        <AttendanceSummaryTable data={summary} />
      </div>
    </MainLayout>
  );
}
