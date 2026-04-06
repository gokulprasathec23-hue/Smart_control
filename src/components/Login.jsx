import { useState } from 'react';
import axios from 'axios';
import { Settings, Lock, User } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://smart-backend-mu.vercel.app';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/login`, { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({ username: res.data.username, role: res.data.role }));
      setAuth(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const checkDbConnection = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/health`);
      setDbStatus(res.data);
    } catch (err) {
      setDbStatus({ status: 'error', message: 'Database connection failed' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1565514020179-026b92b2d79b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center">
      <div className="absolute inset-0 bg-dark-900/80 backdrop-blur-sm"></div>
      
      <div className="glass-panel relative z-10 w-full max-w-md p-8 sm:p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-primary/20 p-4 rounded-full mb-4">
            <Settings className="w-12 h-12 text-primary animate-[spin_10s_linear_infinite]" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">Smart Control Panel</h1>
          <p className="text-sm text-slate-400">Industrial IoT Operations</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {dbStatus && (
          <div className={`border text-sm p-3 rounded-lg mb-6 text-center ${dbStatus.status === 'ok' ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-red-500/10 border-red-500/50 text-red-400'}`}>
            DB Status: {dbStatus.message}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Username</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-dark-700/50 border border-slate-600 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter your username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-dark-700/50 border border-slate-600 rounded-xl py-3 pl-11 pr-4 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary py-3 text-lg font-semibold mt-4 shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Settings className="w-5 h-5 animate-spin" />
                Authenticating...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <button
            onClick={checkDbConnection}
            className="text-xs text-slate-500 hover:text-slate-400 transition-colors underline"
          >
            Check Database Connection
          </button>
        </div>
        
        <div className="mt-8 text-center text-xs text-slate-500">
          <p className="font-semibold text-slate-300">Quick Start Demo</p>
          <p>Enter any username & password</p>
          <p>Auto-creates user on first login</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
