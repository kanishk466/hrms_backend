import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PageHeader } from '@/components/layout/PageHeader';
import { EmployeeTable } from '@/components/employees/EmployeeTable';
import { EmployeeForm } from '@/components/employees/EmployeeForm';
import { DeleteEmployeeDialog } from '@/components/employees/DeleteEmployeeDialog';
import { Button } from '@/components/ui/button';
import { Employee } from '@/types/hrms';
import { useToast } from '@/hooks/use-toast';

export default function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const { toast } = useToast();

  const handleAdd = () => {
    setSelectedEmployee(null);
    setIsFormOpen(true);
  };



  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDeleteOpen(true);
  };

  const handleFormSubmit = (data: Omit<Employee, 'id' | 'joinDate'>) => {
    if (selectedEmployee) {
      // Update existing employee
      setEmployees((prev) =>
        prev.map((emp) =>
          emp.id === selectedEmployee.id ? { ...emp, ...data } : emp
        )
      );
      toast({
        title: 'Employee updated',
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      // Add new employee -> POST to backend
      const payload = {
        employeeId: `EMP${Date.now()}`,
        fullName: data.name,
        email: data.email,
        department: data.department,
      };

      fetch('https://hrms-backend-n8nc.onrender.com/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to add employee');
          return res.json();
        })
        .then((created) => {
          const mapped: Employee = {
            id: created._id || String(Date.now()),
            name: created.fullName || data.name,
            email: created.email || data.email,
            department: created.department || data.department,
            employeeId: created.employeeId || payload.employeeId,
            joinDate: new Date().toISOString().split('T')[0],
            status: (data as any).status || 'active',
          };
          setEmployees((prev) => [...prev, mapped]);
          toast({
            title: 'Employee added',
            description: `${data.name} has been added successfully.`,
          });
        })
        .catch(() => {
          toast({
            title: 'Error',
            description: 'Failed to add employee. Please try again.',
            variant: 'destructive',
          });
        });
    }
  };

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

  const handleConfirmDelete = () => {
    if (!selectedEmployee) return;

    // console.log('Deleting employee:', selectedEmployee);
    fetch(`https://hrms-backend-n8nc.onrender.com/api/employees/${selectedEmployee.employeeId}`, {
      method: 'DELETE',
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete employee');
        setEmployees((prev) => prev.filter((emp) => emp.employeeId !== selectedEmployee.employeeId));
        toast({
          title: 'Employee deleted',
          description: `${selectedEmployee.name} has been removed.`,
          variant: 'destructive',
        });
        setIsDeleteOpen(false);
        setSelectedEmployee(null);
      })
      .catch(() => {
        toast({
          title: 'Error',
          description: 'Failed to delete employee. Please try again.',
          variant: 'destructive',
        });
      });
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <PageHeader
          title="Employees"
          description="Manage your team members and their information"
          action={
            <Button onClick={handleAdd} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Employee
            </Button>
          }
        />

        <EmployeeTable
          employees={employees}
          onDelete={handleDelete}
        />

        <EmployeeForm
          open={isFormOpen}
          onOpenChange={setIsFormOpen}
          employee={selectedEmployee}
          onSubmit={handleFormSubmit}
        />

        <DeleteEmployeeDialog
          open={isDeleteOpen}
          onOpenChange={setIsDeleteOpen}
          employee={selectedEmployee}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </MainLayout>
  );
}
