'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative w-full flex-1 flex flex-col min-h-screen">
      {/* Top accent bar running on native CSS animation */}
      <div
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 origin-left z-50 pointer-events-none animate-route-line"
      />

      {/* Pure CSS opacity fade with zero JS frame calculation overhead */}
      <div className="w-full flex-1 flex flex-col animate-fade-in">
        {children}
      </div>
    </div>
  );
}