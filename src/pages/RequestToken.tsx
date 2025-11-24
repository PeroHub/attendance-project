import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';

const RequestToken = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenSent, setTokenSent] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Replace with your API endpoint
      const response = await fetch('https://staff-attendance-d4tr.onrender.com/api/request-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      localStorage.setItem('email', email);

      if (response.ok) {
        setTokenSent(true);
        toast({
          title: "Token sent!",
          description: "Please check your email for the login token.",
        });
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.msg || 'Fail to send token.';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: error.message || "Failed to send token. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (tokenSent) {
    return (
      <Layout 
        title="Check Your Email" 
        subtitle="We've sent you a secure login token"
      >
        <div className="max-w-md mx-auto">
          <Card className="bg-gradient-card shadow-elevated">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="w-8 h-8 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Token Sent Successfully</h3>
                  <p className="text-muted-foreground mb-4">
                    We've sent a secure login token to <strong>{email}</strong>
                  </p>
                  <div className="bg-warning/10 p-3 rounded-lg">
                    <div className="flex items-center space-x-2 text-warning">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">Token expires in 45 seconds</span>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => window.location.href = '/login'} 
                  className="w-full bg-gradient-primary hover:opacity-90"
                >
                  Go to Login Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout 
      title="Staff Check-in" 
      subtitle="Enter your email to receive a secure login token"
    >
      <div className="max-w-md mx-auto">
        <div className='mx-auto p-4'>
          <h3 className=''><span className='font-bold mr-2'>Student name:</span> <span>Etim, Ekuyik Udah</span></h3>
          <p className='mt-4'><span className='font-bold mr-2'>Reg No:</span> <span>AKP/ASC/SWD/HND2023/0005</span></p>
          <p className='mt-4'><span className='font-bold mr-2'>Topic:</span><span>Automated Clocking System</span></p>
          <p className='mt-4 mb-4'><span className='font-bold mr-2'>Supervisor: </span><span>Prince Jimmy Okoko</span></p>
        </div>
        <Card className="bg-gradient-card shadow-elevated">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">Secure Access</CardTitle>
            <CardDescription>
              Enter your registered email address to receive a time-sensitive login token
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 text-lg"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-primary hover:opacity-90 shadow-primary"
                disabled={loading}
              >
                {loading ? 'Sending Token...' : 'Send Login Token'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="text-center text-sm text-muted-foreground space-y-2">
                <p className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Tokens expire after 45 Seconds</span>
                </p>
                <p>For security, only registered staff emails are accepted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RequestToken;