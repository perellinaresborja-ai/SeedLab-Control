import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Lock, Mail, AlertTriangle } from 'lucide-react';

export default function Login() {
  const { login } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('/grid.svg')] bg-center relative">
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1c] via-transparent to-transparent pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-primary-cyan/10 border-2 border-primary-cyan/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <ShieldCheck className="w-8 h-8 text-primary-cyan" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-extrabold text-white tracking-tight">
          SeedLab Control
        </h2>
        <p className="mt-2 text-center text-sm text-text-muted">
          Sign in to access your secure dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#06111f]/80 backdrop-blur-xl py-8 px-4 shadow-2xl border border-border sm:rounded-xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-center text-red-500 text-sm">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-text-muted/70" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-primary-cyan sm:text-sm transition-colors"
                  placeholder="admin@seedlab.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-text-muted/70" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-white placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-primary-cyan focus:border-primary-cyan sm:text-sm transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-black bg-primary-cyan hover:bg-primary-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0a0f1c] focus:ring-primary-cyan transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Authenticating...' : 'Secure Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
