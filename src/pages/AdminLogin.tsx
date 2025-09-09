import React, { useState } from 'react';
import { UserRound, LockKeyhole, ArrowLeft } from 'lucide-react';

// Main App component
const AdminLogin = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // State for UI and messaging
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  
  // Function to display messages in the UI
  const showMessage = (msg, isError = false) => {
    setMessage(msg);
    setIsError(isError);
  };
  
  // --- Login API Call ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    showMessage(''); // Clear previous messages

    // Log the user's email and password to the console
    console.log("Attempting login with:", { email, password });

    try {
      // The login payload now uses the dynamic email and password from the state
      const loginPayload = {
        email: email, 
        password: password,
      };

      const response = await fetch('https://staff-attendance-d4tr.onrender.com/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginPayload),
      });

      response.json().then(data => {
        localStorage.setItem('adminToken', data.token);
        window.location.href = '/admin'; // Redirect on success
      });

     
    } catch (error) {
      console.error(error);
      showMessage(error.message || "Please check your credentials and try again.", true);
    } finally {
      setLoading(false);
    }
  };

  // --- UI Components ---
  // Card Component
  const Card = ({ children }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 hover:scale-[1.01] border border-white/20">
      {children}
    </div>
  );

  // CardHeader Component
  const CardHeader = ({ children }) => (
    <div className="text-center mb-6">
      {children}
    </div>
  );
  
  // CardTitle Component
  const CardTitle = ({ children }) => (
    <h2 className="text-3xl font-bold text-black-700 mb-2">{children}</h2>
  );
  
  // CardDescription Component
  const CardDescription = ({ children }) => (
    <p className="text-sm text-gray-600">{children}</p>
  );

  // CardContent Component
  const CardContent = ({ children }) => (
    <div>
      {children}
    </div>
  );

  // Input Component
  const Input = ({ type, placeholder, value, onChange, icon }) => (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        className="w-full pl-10 pr-4 py-3 bg-white/5  placeholder-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200 border border-gray-700"
      />
    </div>
  );

  // Button Component
  const Button = ({
    children,
    type = 'button',
    onClick,
    disabled,
    className,
  }: {
    children: React.ReactNode;
    type?: 'button' | 'reset' | 'submit';
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
    className?: string;
  }) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-3 rounded-lg text-lg font-semibold transition-all duration-300
        ${className}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 transform hover:scale-[1.02]'}
      `}
    >
      {children}
    </button>
  );

  // --- Main Render Block ---
  return (
    <div className="flex items-center justify-center min-h-screen  text-gray-600 p-4 font-sans antialiased">
      <div className="max-w-md w-full">
        <Card>
          <CardHeader>
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <UserRound className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>
              Enter your admin credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<UserRound size={20} />}
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<LockKeyhole size={20} />}
              />
              
              <Button
                type="submit"
                className="bg-gradient-primary text-white shadow-lg shadow-purple-500/30"
                disabled={loading}
              >
                {loading ? 'Logging In...' : 'Login'}
              </Button>
            </form>
            
            {message && (
              <div className={`mt-6 text-center text-sm font-medium p-3 rounded-lg ${isError ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                {message}
              </div>
            )}

            {/* <div className="mt-6 pt-6 border-t border-gray-700">
              <Button
                className="bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-200"
                onClick={() => {}} // In a real app, this might go back to the main site
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Return to Main Site
              </Button>
            </div> */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminLogin;
