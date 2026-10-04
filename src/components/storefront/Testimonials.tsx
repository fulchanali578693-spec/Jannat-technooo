import React from 'react';
import { Heart, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Sarah M.',
      role: 'Verified Buyer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=60',
      comment: 'Amazing deals and super fast doorstep delivery! My go-to store now. Cash on delivery was so convenient.',
      rating: 5,
    },
    {
      name: 'Ali R.',
      role: 'DealKart+ Member',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=60',
      comment: 'Saved so much with the bundle savings. The quality is top notch and the courier allowed me to verify before paying.',
      rating: 5,
    },
    {
      name: 'Ayesha K.',
      role: 'Verified Buyer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=60',
      comment: 'Best marketplace for quality products at unbeatable prices. Easy checkout without needing any credit card!',
      rating: 5,
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 border-t border-gray-100">
      
      <div className="flex items-center gap-2 mb-6">
        <Heart className="w-5 h-5 text-purple-700 fill-purple-700" />
        <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          Loved By Thousands
        </h3>
        <span className="text-xs text-gray-400 font-medium">· Real Customers. Real Savings.</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-start gap-3.5"
          >
            <img
              src={r.avatar}
              alt={r.name}
              className="w-11 h-11 rounded-full object-cover shrink-0 border border-gray-200"
            />
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900">{r.name}</span>
                <div className="flex text-amber-400">
                  {[...Array(r.rating)].map((_, idx) => (
                    <Star key={idx} className="w-3 h-3 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed italic">
                "{r.comment}"
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
