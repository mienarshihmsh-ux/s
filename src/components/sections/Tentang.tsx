"use client"

import React from 'react';
import { TentangData } from '@/lib/types';

interface TentangProps {
  data: TentangData;
}

export function Tentang({ data }: TentangProps) {
  return (
    <section id="tentang" className="section section-light py-20 px-[5%] bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="section-title">
          <i className="fas fa-info-circle mr-3"></i> Tentang Kami
        </h2>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <i className="fas fa-quote-left absolute -top-8 -left-8 text-6xl text-primary/10"></i>
            <p className="text-lg leading-relaxed text-muted-foreground italic relative z-10">
              {data.deskripsi || 'Memuat deskripsi...'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <StatCard 
              icon="fas fa-users" 
              label="Santri Aktif" 
              value={data.santri || '0'} 
            />
            <StatCard 
              icon="fas fa-chalkboard-teacher" 
              label="Tenaga Pengajar" 
              value={data.ustadz || '0'} 
            />
            <StatCard 
              icon="fas fa-book-quran" 
              label="Program Unggulan" 
              value={data.program || '0'} 
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const StatCard = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
  <div className="stat-card">
    <div className="mb-4 flex justify-center text-[#f9e79f]">
      <i className={`${icon} text-4xl`}></i>
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-xs uppercase tracking-wider opacity-90">{label}</div>
  </div>
);
