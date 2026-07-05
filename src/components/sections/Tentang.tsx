
"use client"

import React from 'react';
import { TentangData } from '@/lib/types';
import { Info } from 'lucide-react';
import Image from 'next/image';

interface TentangProps {
  data: TentangData;
  imageUrl?: string;
}

export function Tentang({ data, imageUrl }: TentangProps) {
  return (
    <section id="tentang" className="section section-light py-24 px-[5%] bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Judul dengan Ikon dan Teks yang sejajar di tengah dengan garis kuning di bawahnya */}
        <h2 className="section-title">
          <span className="flex items-center justify-center gap-3">
            <Info className="w-8 h-8 md:w-9 md:h-9 text-primary" />
            <span>Tentang Kami</span>
          </span>
        </h2>

        <div className="grid lg:grid-cols-12 gap-12 items-start mt-16">
          {/* Kolom Deskripsi (Kiri) */}
          <div className="lg:col-span-7 relative">
            <div className="absolute -top-10 -left-6 opacity-10">
              <i className="fas fa-quote-left text-8xl text-primary"></i>
            </div>
            <div className="relative z-10">
              <p className="text-lg md:text-xl leading-relaxed text-muted-foreground italic text-justify">
                {data.deskripsi || 'Memuat deskripsi...'}
              </p>
            </div>
          </div>

          {/* Kolom Media & Statistik (Kanan) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Gambar Utama dengan object-contain agar tidak terpotong bagian kepala */}
            {imageUrl && (
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border-4 border-white transition-transform duration-500 hover:scale-[1.01] bg-muted/5">
                <Image 
                  src={imageUrl} 
                  alt="Tentang TPA AL IMAN" 
                  fill 
                  className="object-contain object-center"
                  data-ai-hint="islamic activity"
                  priority
                />
              </div>
            )}

            {/* Statistik Cards disusun Horizontal */}
            <div className="flex flex-row gap-3 w-full">
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
      </div>
    </section>
  );
}

const StatCard = ({ icon, label, value }: { icon: string; label: string; value: string | number }) => (
  <div className="bg-primary p-4 md:p-5 rounded-2xl text-center text-white transition-all duration-300 shadow-lg hover:-translate-y-1.5 flex flex-col items-center justify-center flex-1 min-h-[120px]">
    <div className="mb-2 text-[#f9e79f]">
      <i className={`${icon} text-2xl md:text-3xl`}></i>
    </div>
    <div className="text-xl md:text-2xl font-bold mb-0.5">{value}</div>
    <div className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest opacity-90 leading-tight">
      {label}
    </div>
  </div>
);
