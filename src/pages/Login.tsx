import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyRound, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import { json } from 'stream/consumers';

const Login = () => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setLoading(true);
    const email = localStorage.getItem('email')
    console.log(email);
    try {
      // Replace with your API endpoint
      const response = await fetch('https://staff-attendance-d4tr.onrender.com/api/check-in', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, email }),
      });
      

      if (response.ok) {
        const data = await response.json();
        console.log(data, "login response data");
        // Store user session data
        localStorage.setItem('userToken', JSON.stringify(data.token));
        localStorage.setItem('userId', data.user);
        
        toast({
          title: "Login successful!",
          description: "Welcome to the attendance system.",
        });
        
        // Redirect to dashboard
        window.location.href = '/dashboard';
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.msg || 'An unknown error occurred.';
        if ( errorMessage === 'You are already checked in.') {
          window.location.href = '/dashboard';
          return;
        }
        throw new Error(errorMessage);

      }
    } catch (error) {
      console.log(error);
    toast({
        title: "Authentication failed",
        description: error.message || "Please check your token and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout 
      title="Enter Login Token" 
      subtitle="Check your email and enter the token below"
    >
      <div className="max-w-md mx-auto">
        <Card className="bg-gradient-card shadow-elevated">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Verify Token</CardTitle>
            <CardDescription>
              Enter the 6-digit token sent to your email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="000000"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  required
                  className="h-12 text-2xl text-center tracking-widest font-mono"
                  maxLength={6}
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-primary hover:opacity-90 shadow-primary"
                disabled={loading || token.length !== 6}
              >
                {loading ? 'Verifying...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <Button 
                variant="ghost" 
                className="w-full" 
                onClick={() => window.location.href = '/'}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Request New Token
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              <p>Token not received? Check your spam folder or request a new one</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Login;