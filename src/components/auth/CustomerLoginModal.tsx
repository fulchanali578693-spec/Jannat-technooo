import React, { useState } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  googleProvider 
} from '../../firebase';
import { useStore } from '../../context/StoreContext';
import { 
  X, 
  Mail, 
  Key, 
  User, 
  Zap, 
  ArrowRight, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

interface CustomerLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerLoginModal: React.FC<CustomerLoginModalProps> = ({ isOpen, onClose }) => {
  const { settings } = useStore();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    const trimmedEmail = email.trim();
    const trimmedPass = password.trim();

    try {
      if (mode === 'signin') {
        await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
      } else {
        await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPass);
      }
      onClose();
    } catch (err: any) {
      console.warn('Firebase auth attempt:', err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Invalid email or password. If you are new, click "Create Account".');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('An account with this email already exists. Please sign in instead.');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Password should be at least 6 characters long.');
      } else {
        setErrorMsg(err.message?.replace('Firebase: ', '') || 'Authentication failed. Please verify your details.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onClose();
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setErrorMsg(err.message?.replace('Firebase: ', '') || 'Google authentication was cancelled or unavailable.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        onClick={onClose} 
        className="fixed inset-0"
      />

      <div className="w-full max-w-md bg-white text-gray-900 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-900 transition p-1 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-[#5A189A] rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md">
            <Zap className="w-7 h-7 text-[#C4F000] fill-[#C4F000]" />
          </div>
          <h3 className="text-2xl font-black tracking-tight text-gray-900">
            {settings.storeName} Customer Account
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            Sign in through Firebase to access member deals & track COD orders
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => { setMode('signin'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signin'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setErrorMsg(null); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'signup'
                ? 'bg-white text-black shadow-xs'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Message Banner */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="font-semibold">{errorMsg}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-black transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-black transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1">
              Password
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 text-xs outline-none focus:border-black transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#130428] hover:bg-[#5A189A] active:scale-98 disabled:bg-gray-400 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <span>{mode === 'signin' ? 'Sign In with Firebase' : 'Create Account'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C4F000]" />
              </>
            )}
          </button>
        </form>

        {/* Google Sign In */}
        <div className="mt-4 pt-3.5 border-t border-gray-100">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full border border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

      </div>
    </div>
  );
};
