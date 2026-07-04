
"use client"

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createPaymentToken } from '@/app/actions/payment';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';

declare global {
  interface Window {
    snap: any;
  }
}

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  appsScriptUrl: string;
}

const MAX_FILE_SIZE = 1024 * 1024; // 1MB

export function RegistrationModal({ isOpen, onClose, appsScriptUrl }: RegistrationModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    telepon: '',
    nisn: '',
    nik: '',
  });

  const [files, setFiles] = useState<{
    foto: File | null;
    ijazah: File | null;
    kk: File | null;
  }>({
    foto: null,
    ijazah: null,
    kk: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === 'nisn') {
      setFormData(prev => ({ ...prev, nisn: value.replace(/\D/g, '').slice(0, 10) }));
    } else if (id === 'nik') {
      setFormData(prev => ({ ...prev, nik: value.replace(/\D/g, '').slice(0, 16) }));
    } else if (id === 'telepon') {
      setFormData(prev => ({ ...prev, telepon: value.replace(/\D/g, '').slice(0, 13) }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];
      if (file.size > MAX_FILE_SIZE) {
        Swal.fire({
          title: 'Berkas Terlalu Besar',
          text: `Ukuran maksimal ${file.name} adalah 1MB.`,
          icon: 'warning',
          confirmButtonColor: '#1e8449',
        });
        e.target.value = '';
        return;
      }
      setFiles(prev => ({ ...prev, [id]: file }));
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const generatePDF = (data: typeof formData, orderId: string) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 132, 73); // Warna hijau primary
    doc.text('TPA AL IMAN', 105, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('BUKTI PENDAFTARAN SANTRI BARU', 105, 30, { align: 'center' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 35, 190, 35);
    
    // Content
    doc.setFontSize(12);
    let y = 50;
    const lineHeight = 10;
    
    doc.text(`No. Registrasi: ${orderId}`, 20, y); y += lineHeight;
    doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 20, y); y += lineHeight + 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Data Calon Santri:', 20, y); y += lineHeight;
    doc.setFont('helvetica', 'normal');
    
    doc.text(`Nama Lengkap: ${data.nama}`, 30, y); y += lineHeight;
    doc.text(`NISN: ${data.nisn}`, 30, y); y += lineHeight;
    doc.text(`NIK: ${data.nik}`, 30, y); y += lineHeight;
    doc.text(`Email: ${data.email}`, 30, y); y += lineHeight;
    doc.text(`No. WhatsApp: ${data.telepon}`, 30, y); y += lineHeight + 5;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Status Pembayaran:', 20, y); y += lineHeight;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(30, 132, 73);
    doc.text('LUNAS (Rp 50.000)', 30, y); y += lineHeight + 20;
    
    // Footer
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(10);
    doc.text('Terima kasih telah melakukan pendaftaran digital di TPA AL IMAN.', 105, y, { align: 'center' }); y += 5;
    doc.text('Silakan simpan bukti ini untuk keperluan administrasi selanjutnya.', 105, y, { align: 'center' });
    
    doc.save(`Bukti_Pendaftaran_${data.nama.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.email || !formData.telepon || !formData.nisn || !formData.nik || !files.foto || !files.ijazah || !files.kk) {
      Swal.fire({
        title: 'Form Tidak Lengkap',
        text: 'Semua kolom wajib diisi dan berkas wajib diunggah!',
        icon: 'warning',
        confirmButtonColor: '#1e8449',
      });
      return;
    }

    setLoading(true);

    try {
      const fotoBase64 = await fileToBase64(files.foto);
      const ijazahBase64 = await fileToBase64(files.ijazah);
      const kkBase64 = await fileToBase64(files.kk);

      const bodyParams = new URLSearchParams();
      bodyParams.append('nama', formData.nama);
      bodyParams.append('email', formData.email);
      bodyParams.append('noTelp', formData.telepon);
      bodyParams.append('nisn', formData.nisn);
      bodyParams.append('nik', formData.nik);
      bodyParams.append('foto', fotoBase64);
      bodyParams.append('fotoExt', files.foto.name.split('.').pop() || 'jpg');
      bodyParams.append('ijazah', ijazahBase64);
      bodyParams.append('kk', kkBase64);

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: bodyParams.toString(),
      });

      const result = await response.json();

      if (result.result !== 'success') {
        setLoading(false);
        Swal.fire({
          title: 'Pendaftaran Gagal',
          text: result.message || 'Terjadi kesalahan pada server.',
          icon: 'error',
          confirmButtonColor: '#1e8449',
        });
        return;
      }

      const orderId = `REG-${Date.now()}-${formData.nisn}`;
      const amount = 50000; 

      const paymentResult = await createPaymentToken({
        amount,
        orderId,
        customerName: formData.nama,
        email: formData.email
      });

      setLoading(false);

      if (window.snap && paymentResult?.token) {
        window.snap.pay(paymentResult.token, {
          onSuccess: () => {
            const finalData = { ...formData };
            Swal.fire({
              title: 'Berhasil!',
              text: 'Pendaftaran dan pembayaran telah selesai.',
              icon: 'success',
              showCancelButton: true,
              confirmButtonColor: '#1e8449',
              cancelButtonColor: '#6c757d',
              confirmButtonText: '<i class="fas fa-download"></i> Unduh Bukti PDF',
              cancelButtonText: 'Tutup',
            }).then((result) => {
              if (result.isConfirmed) {
                generatePDF(finalData, orderId);
              }
              onClose();
              setFormData({ nama: '', email: '', telepon: '', nisn: '', nik: '' });
            });
          },
          onPending: () => {
            Swal.fire({
              title: 'Menunggu Pembayaran',
              text: 'Silakan selesaikan pembayaran Anda.',
              icon: 'info',
              confirmButtonColor: '#1e8449',
            });
          },
          onError: () => {
            Swal.fire({
              title: 'Gagal',
              text: 'Terjadi kesalahan pada pembayaran.',
              icon: 'error',
              confirmButtonColor: '#1e8449',
            });
          }
        });
      }

    } catch (error: any) {
      setLoading(false);
      console.error("Submission error:", error);
      Swal.fire({
        title: 'Kesalahan Sistem',
        text: 'Gagal menghubungi server pendaftaran. Silakan coba lagi nanti.',
        icon: 'error',
        confirmButtonColor: '#1e8449',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[650px] max-h-[95vh] overflow-y-auto rounded-3xl p-8 border-none shadow-2xl z-[1200]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
            <i className="fas fa-paper-plane"></i> Form Pendaftaran Santri Baru
          </DialogTitle>
          <DialogDescription className="text-base">
            Lengkapi data santri. Biaya pendaftaran Rp 50.000.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nama" className="flex items-center gap-2 font-semibold">
              <i className="fas fa-user text-primary"></i> Nama Lengkap Santri
            </Label>
            <Input id="nama" placeholder="Nama Lengkap" className="h-12 border-2 rounded-xl" value={formData.nama} onChange={handleInputChange} autoComplete="off" required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 font-semibold">
                <i className="fas fa-envelope text-primary"></i> Email
              </Label>
              <Input id="email" type="email" placeholder="email@contoh.com" className="h-12 border-2 rounded-xl" value={formData.email} onChange={handleInputChange} autoComplete="off" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telepon" className="flex items-center gap-2 font-semibold">
                <i className="fas fa-phone text-primary"></i> No. WhatsApp
              </Label>
              <Input id="telepon" placeholder="0812xxxxxxxx" className="h-12 border-2 rounded-xl" value={formData.telepon} onChange={handleInputChange} autoComplete="off" required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nisn" className="flex items-center gap-2 font-semibold">
                <i className="fas fa-id-card text-primary"></i> NISN
              </Label>
              <Input id="nisn" placeholder="10 digit angka" className="h-12 border-2 rounded-xl" value={formData.nisn} onChange={handleInputChange} autoComplete="off" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nik" className="flex items-center gap-2 font-semibold">
                <i className="fas fa-id-card text-primary"></i> NIK
              </Label>
              <Input id="nik" placeholder="16 digit angka" className="h-12 border-2 rounded-xl" value={formData.nik} onChange={handleInputChange} autoComplete="off" required />
            </div>
          </div>

          <div className="space-y-5 bg-muted/30 p-6 rounded-2xl border border-dashed border-primary/20">
            <div className="space-y-2">
              <Label htmlFor="foto" className="font-semibold">Foto (.jpg/.png, Max 1MB)</Label>
              <Input id="foto" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="bg-white border-2 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ijazah" className="font-semibold">Ijazah (PDF, Max 1MB)</Label>
              <Input id="ijazah" type="file" accept=".pdf" onChange={handleFileChange} className="bg-white border-2 rounded-xl" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="kk" className="font-semibold">KK (PDF, Max 1MB)</Label>
              <Input id="kk" type="file" accept=".pdf" onChange={handleFileChange} className="bg-white border-2 rounded-xl" required />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full h-14 text-lg font-bold rounded-xl hero-gradient" disabled={loading}>
              {loading ? 'Sedang Memproses...' : 'Kirim & Bayar Sekarang'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
