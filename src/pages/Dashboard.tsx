import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, LogIn, LogOut, Calendar, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '../components/Layout';

interface AttendanceRecord {
  id: string;
  checkIn: string;
  checkOut?: string;
  duration?: string;
  date: string;
}

const Dashboard = () => {
  interface User {
    name: string;
    email: string | null;
  }

  const [user, setUser] = useState<User | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [currentSession, setCurrentSession] = useState<AttendanceRecord | null>(null);
  const [recentRecords, setRecentRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const email = localStorage.getItem('email');
    setUser({ name: 'User', email }); // Placeholder, replace with actual user data
    // const userId = localStorage.getItem('userId');
    
    if (!email) {
      window.location.href = '/';
      return;
    }

    // Set up a timer to update the current time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Fetch user data and current status
    // fetchUserData();
    // fetchAttendanceRecords();

    // Cleanup the timer when the component unmounts
    return () => clearInterval(timer);
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user-status', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userToken') || '')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setIsCheckedIn(data.isCheckedIn);
        setCurrentSession(data.currentSession);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch('/api/attendance-records', {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userToken') || '')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setRecentRecords(data.records);
      }
    } catch (error) {
      console.error('Failed to fetch attendance records:', error);
    }
  };

  const handleCheckIn = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/check-in', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsCheckedIn(true);
        setCurrentSession(data.session);
        toast({
          title: "Checked in successfully!",
          description: `Welcome ${user?.name}. Your shift has started.`,
        });
      }
    } catch (error) {
      toast({
        title: "Check-in failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOut = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://staff-attendance-d4tr.onrender.com/api/check-out', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('userToken') || '')}`
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsCheckedIn(false);
        setCurrentSession(null);
        toast({
          title: "Checked out successfully!",
          // description: `Total time worked: ${data.duration}`,
        });
        fetchAttendanceRecords(); // Refresh records
      }
    } catch (error) {
      toast({
        title: "Check-out failed",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await handleCheckOut()
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    window.location.href = '/';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return <Layout><div>Loading...</div></Layout>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* User Welcome Section */}
        <Card className="bg-gradient-card shadow-card">
          <CardContent className="pt-6">
            <div className="md:flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Welcome, {user.email}</h2>
                  {/* <p className="text-muted-foreground">{user.email}</p> */}
                </div>
              </div>
              <div className="text-right mt-6 md:mt-0">
                <p className="text-2xl font-bold text-foreground">
                  {currentTime.toLocaleTimeString('en-US', {
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentTime.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check In/Out Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-card shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>Current Status</span>
              </CardTitle>
              <CardDescription>
                {user.email ? 'You are currently checked in' : 'Ready to start your shift'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={user.email ? "default" : "secondary"}>
                  {user.email ? 'Checked In' : 'Checked Out'}
                </Badge>
              </div>
              
              {isCheckedIn && currentSession && (
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Started at:</span>
                  <span className="text-sm text-muted-foreground">
                    {formatTime(currentSession.checkIn)}
                  </span>
                </div>
              )}

              {/* <div className="pt-4">
                {!isCheckedIn ? (
                  <Button 
                    onClick={handleCheckIn}
                    variant="success"
                    className="w-full h-12"
                    disabled={loading}
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    {loading ? 'Checking In...' : 'Check In'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCheckOut}
                    variant="destructive"
                    className="w-full h-12"
                    disabled={loading}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {loading ? 'Checking Out...' : 'Check Out'}
                  </Button>
                )}
              </div> */}
            </CardContent>
          </Card>

          {/* Recent Records */}
          {/* <Card className="bg-gradient-card shadow-elevated">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Recent Activity</span>
              </CardTitle>
              <CardDescription>Your latest attendance records</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentRecords.length > 0 ? (
                  recentRecords.slice(0, 3).map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{record.date}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatTime(record.checkIn)} - {record.checkOut ? formatTime(record.checkOut) : 'In Progress'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.duration || 'Active'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No recent records found
                  </p>
                )}
              </div>
            </CardContent>
          </Card> */}
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <Button variant="outline" onClick={handleLogout}>
            Check Out
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
