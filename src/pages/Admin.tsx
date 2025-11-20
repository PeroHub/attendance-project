import React, { useState, useEffect } from 'react';
import StaffListComponent from './StaffList';

// Self-contained UI components to avoid external imports
const Button = ({ children, className = '', ...props }) => <button className={`px-4 flex items-center justify-center py-2 font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props}>{children}</button>;
const Input = ({ className = '', ...props }) => <input className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`} {...props} />;
const Label = ({ children, htmlFor, className = '' }) => <label htmlFor={htmlFor} className={`text-sm font-medium text-gray-700 ${className}`}>{children}</label>;
const Card = ({ children, className = '' }) => <div className={`bg-white rounded-xl shadow-lg ${className}`}>{children}</div>;
const CardContent = ({ children, className = '' }) => <div className={`p-6 ${className}`}>{children}</div>;
const CardDescription = ({ children }) => <p className="text-sm text-gray-500 mt-1">{children}</p>;
const CardHeader = ({ children }) => <div className="p-6 pb-2">{children}</div>;
const CardTitle = ({ children }) => <h2 className="text-xl font-semibold text-gray-900">{children}</h2>;
const Badge = ({ children, variant }) => {
  const variants = {
    default: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
  };
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]}`}>{children}</span>;
};
const Table = ({ children }) => <div className="overflow-x-auto rounded-lg border"><table className="min-w-full divide-y divide-gray-200">{children}</table></div>;
const TableBody = ({ children }) => <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>;
const TableCell = ({ children, className = '' }) => <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${className}`}>{children}</td>;
const TableHead = ({ children, className = '' }) => <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className}`}>{children}</th>;
const TableHeader = ({ children }) => <thead className="bg-gray-50">{children}</thead>;
const TableRow = ({ children }) => <tr>{children}</tr>;
const useToast = () => ({ toast: (options) => console.log('Toast:', options) }); // Simple console log for demo
const Layout = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-gray-100 p-8">
    <header className="text-center mb-8">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-lg text-gray-600">{subtitle}</p>
    </header>
    <main>{children}</main>
  </div>
);
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};


// Lucide Icons
const Users = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const Clock = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const Calendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const Search = ({ className = '', ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`text-gray-400 ${className}`}
    {...props}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const Plus = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

interface AttendanceRecord {
  id: string;
  staffName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  duration?: string;
}

const formatTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-US', {
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const formatDuration = (totalHours) => {
  if (totalHours === 0) return '0h 0m';
  const hours = Math.floor(totalHours);
  const minutes = Math.round((totalHours - hours) * 60);
  return `${hours}h ${minutes}m`;
};

const AdminDashboard = () => {
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [errorAddStaff, setErrorAddStaff] = useState('');
  const [totalStaff, setTotalStaff] = useState(0);
  const [staffData, setStaffData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toggleTable, setToggleTable] = useState('records');
  const [newStaffForm, setNewStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const { toast } = useToast();

  const handleTabChange = (tab) => {
    setToggleTable(tab);
  }

  useEffect(() => {
    // Check admin authentication - dummy check for demonstration
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      window.location.href = '/admin/login';
      return;
    }

    fetchAttendanceRecords();
  }, []);

  useEffect(() => {
    if (errorAddStaff) {
      const timer = setTimeout(() => setErrorAddStaff(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorAddStaff]);

  
    

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    const getLocalStorageToken = localStorage.getItem('adminToken');
    try {
      const response = await fetch('https://staff-attendance-d4tr.onrender.com/api/admin/attendance-records', {
        headers: {
          'x-auth-token': `${getLocalStorageToken}`,
        },
      });

     const totalStaffResponse = await fetch('https://staff-attendance-d4tr.onrender.com/api/admin/total-staff', {
      headers: {
        'x-auth-token': `${getLocalStorageToken}`,
      }
     })

     totalStaffResponse.json().then(data => {
      setTotalStaff(data.totalStaff || 0);
      setStaffData(data || null);
      console.log(data, "total staff");
     })

      if (response.ok) {
        const data = await response.json();
        const formattedRecords = data.map(record => {
          const staffName = `${record.userId.firstName} ${record.userId.lastName}`;
          const duration = record.totalHoursWorked ? formatDuration(record.totalHoursWorked) : undefined;
          const checkOut = record.checkOutTime ? formatTime(record.checkOutTime) : undefined;
          
          return {
            id: record._id,
            staffName: staffName,
            date: new Date(record.checkInTime).toLocaleDateString(),
            checkIn: formatTime(record.checkInTime),
            checkOut: checkOut,
            duration: duration,
          };
        });
        setAttendanceRecords(formattedRecords);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch attendance records.');
      }
    } catch (error) {
      console.error('Failed to fetch attendance records:', error);
      toast({
        title: "Error",
        description: error.message || "Could not load attendance records.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };



  const calculateTotalHours = () => {
    return attendanceRecords
      .reduce((total, record) => {
        const durationMatch = record.duration?.match(/(\d+)h (\d+)m/);
        if (durationMatch) {
            const hours = parseInt(durationMatch[1], 10);
            const minutes = parseInt(durationMatch[2], 10);
            return total + hours + (minutes / 60);
        }
        return total;
      }, 0)
      .toFixed(1);
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    setLoading(true);

    try {
      const response = await fetch('https://staff-attendance-d4tr.onrender.com/api/admin/add-staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(newStaffForm),
      });

      response.json().then(data => {
        setErrorAddStaff(data.msg || '');
      })

      if (response.ok) {
        const newStaff = await response.json();
        console.log("New staff added:", newStaff);
        toast({
          title: "Success",
          description: "New staff member added successfully!",
          variant: "success"
        });
        alert('Staff member added successfully!');
        setIsModalOpen(false);
        setNewStaffForm({ firstName: '', lastName: '', email: '' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add staff member.');
      }
    } catch (error) {
      console.error('Failed to add staff member:', error);
      toast({
        title: "Error",
        description: error.message || "Could not add staff member.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewStaffForm(prev => ({ ...prev, [name]: value }));
  };

  const filteredRecords = attendanceRecords.filter(record =>
    record.staffName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    window.location.href = '/admin/login';
  };

  console.log(toggleTable, "toggleTable");

  return (
    <Layout title="Admin Dashboard" subtitle="Manage staff and monitor attendance">
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button variant="" className='bg-gray-200' onClick={handleLogout}>
            Log Out
          </Button>
        </div>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div onClick={() => handleTabChange('staff')} className='cursor-pointer'>
            <Card className="bg-gradient-card shadow-card" >
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Users />
                  <div>
                    <p className="text-2xl font-bold">{totalStaff}</p>
                    <p className="text-sm text-gray-500">Total Staff</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* <Card className="bg-gradient-card shadow-card">
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock />
                <div>
                  <p className="text-2xl font-bold">0</p>
                  <p className="text-sm text-gray-500">Currently Active</p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          <div onClick={() => handleTabChange('records')} className='cursor-pointer'>

            <Card className="bg-gradient-card shadow-card">
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Calendar />
                  <div>
                    <p className="text-2xl font-bold">{attendanceRecords.length}</p>
                    <p className="text-sm text-gray-500">Total Records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* <Card className="bg-gradient-card shadow-card">
            <CardContent>
              <div className="flex items-center space-x-2">
                <Clock />
                <div>
                  <p className="text-2xl font-bold">{calculateTotalHours()}h</p>
                  <p className="text-sm text-gray-500">Total Hours</p>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Attendance Records Card */}
        <Card>
          {toggleTable === 'staff' ? 
            <StaffListComponent staffDataP={staffData} />
          :
          
        <Card>
          <CardHeader>
            <div className="md:flex items-center justify-between">
              <div>
                <CardTitle>Attendance Records</CardTitle>
                <CardDescription>Monitor staff check-in and check-out times</CardDescription>
              </div>
              <Button className="bg-blue-500 text-white hover:bg-blue-600 mt-4 md:mt-0" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Staff
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search by staff name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Attendance Table */}
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Staff Member</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.staffName}</TableCell>
                    <TableCell>{record.date}</TableCell>
                    <TableCell>{record.checkIn}</TableCell>
                    <TableCell>
                      {record.checkOut || '-'}
                    </TableCell>
                    <TableCell>{record.duration || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={record.checkOut ? 'success' : 'secondary'}>
                        {record.checkOut ? 'Complete' : 'Active'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
          }
        </Card>
      </div>

      {/* Add Staff Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {errorAddStaff && 
          <p className='text-red-700 font-sm mb-6'>{errorAddStaff}</p>
          }
        <div className="sm:flex sm:items-start">
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
            <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Add New Staff Member
            </h3>
            <div className="mt-2">
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={newStaffForm.firstName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={newStaffForm.lastName}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={newStaffForm.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Add Staff'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default AdminDashboard;