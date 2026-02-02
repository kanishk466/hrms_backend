const API_BASE_URL = 'https://hrms-backend-n8nc.onrender.com/api';

export interface AttendancePayload {
  employeeId: string;
  date: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF-DAY';
}

export interface AttendanceResponse {
  _id: string;
  employeeId: string;
  date: string;
  status: string;
}

/**
 * Create a new attendance record
 */
export const createAttendance = async (data: AttendancePayload): Promise<AttendanceResponse> => {
  const response = await fetch(`${API_BASE_URL}/attendance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create attendance record: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get all attendance records, optionally filtered by date
 */
export const getAttendance = async (date?: string): Promise<AttendanceResponse[]> => {
  const url = new URL(`${API_BASE_URL}/attendance`);
  if (date) {
    url.searchParams.append('date', date);
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Failed to fetch attendance records: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get attendance records for a specific employee
 */
export const getAttendanceByEmployeeId = async (employeeId: string): Promise<AttendanceResponse[]> => {
  const response = await fetch(`${API_BASE_URL}/attendance/${employeeId}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch attendance for employee: ${response.statusText}`);
  }

  return response.json();
};
