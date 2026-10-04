import React, { useState } from 'react';
import { Ticket, Copy, Check, Bell, Mail } from 'lucide-react';

export const CouponsBanner: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const coupons = [
    { code: 'SAVE10', discount: '10% OFF', condition: 'Min. Order $50', color: 'from-purple-500/20 to-indigo-500/20 text-purple-700' },
    { code: 'FREESHIP', discount: 'Free Shipping', condition: 'On Orders $35+', color: 'from-teal-500/20 to-emerald-500/20 text-teal-700' },
    { code: 'MEGA20', discount: '20% OFF', condition: 'Member Exclusive', color: 'from-rose-500/20 to-pink-500/20 text-rose-700' },
  ];

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail('');
    }
  };

  return (
    <div id="coupons-section" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left: 3 Coupon Cards */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-700 font-bold text-xs uppercase tracking-wider mb-1">
              <Ticket className="w-4 h-4" />
              <span>Stack Savings On Your Favorites</span>
            </div>
            <h3 className="text-2xl font-black text-gray-900 tracking-tight mb-5">
              Grab Your Coupons
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {coupons.map((c) => {
                const isCopied = copiedCode === c.code;

                return (
                  <div
                    key={c.code}
                    onClick={() => handleCopy(c.code)}
                    className="border-2 border-dashed border-gray-300 hover:border-purple-600 rounded-2xl p-4 text-center cursor-pointer transition-all hover:bg-purple-50/50 group flex flex-col justify-between"
                  >
                    <div>
                      <span className="inline-block bg-[#130428] text-white font-mono font-bold text-xs px-2.5 py-1 rounded-md uppercase tracking-wider mb-2">
                        {c.code}
                      </span>
                      <p className="text-base font-black text-gray-900 leading-tight">
                        {c.discount}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        {c.condition}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-center gap-1 text-[11px] font-semibold text-purple-700 group-hover:text-purple-900">
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-600 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Tap to Copy</span>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4 text-center sm:text-left">
            Coupons can be applied during Cash on Delivery confirmation.
          </p>
        </div>

        {/* Right: Deal Alert Subscribe Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#130428] to-[#29074b] rounded-3xl p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden shadow-sm">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-300 flex items-center justify-center mb-3">
              <Bell className="w-5 h-5" />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight mb-1">
              Never Miss A Deal Again!
            </h3>
            <p className="text-xs sm:text-sm text-purple-200 mb-6">
              Get instant alerts on 70%+ off flash drops and exclusive COD coupons.
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-10 pr-3 py-2.5 text-sm text-white placeholder-gray-400 outline-none focus:bg-white/20 transition"
                />
              </div>
              <button
                type="submit"
                className="bg-[#C4F000] hover:bg-[#b0d800] text-[#130428] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-purple-300">
            🔒 No spam guaranteed. Unsubscribe at any time.
          </div>
        </div>

      </div>
    </div>
  );
};
