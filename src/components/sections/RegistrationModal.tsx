
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
import { cn } from '@/lib/utils';
import { createPaymentToken } from '@/app/actions/payment';
import Swal from 'sweetalert2';

// Deklarasi window.snap untuk typescript
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
      setFormData(prev => ({ ...prev, telepon: value.replace(/\D/g, '') }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      setFiles(prev => ({ ...prev, [id]: selectedFiles[0] }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nama || !formData.email || !formData.telepon || !formData.nisn || !formData.nik || !files.foto || !files.ijazah || !files.kk) {
      Swal.fire({
        title: 'Form Tidak Lengkap',
        text: 'Semua kolom wajib diisi!',
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

      // Gunakan URLSearchParams untuk kompatibilitas e.parameter di Apps Script
      const bodyParams = new URLSearchParams();
      bodyParams.append('nama', formData.nama);
      bodyParams.append('email', formData.email);
      // PENTING: Menggunakan 'noTelp' agar sesuai dengan variabel di Google Apps Script
      bodyParams.append('noTelp', formData.telepon); 
      bodyParams.append('nisn', formData.nisn);
      bodyParams.append('nik', formData.nik);
      bodyParams.append('foto', fotoBase64);
      bodyParams.append('fotoExt', files.foto.name.split('.').pop() || 'jpg');
      bodyParams.append('ijazah', ijazahBase64);
      bodyParams.append('kk', kkBase64);

      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: bodyParams.toString(),
      });

      const result = await response.json();

      if (result.result !== 'success') {
        throw new Error(result.message || 'Gagal menyimpan data ke server');
      }

      // 3. Proses Pembayaran Midtrans
      const orderId = `REG-${Date.now()}-${formData.nisn}`;
      const amount = 50000; 

      const paymentResult = await createPaymentToken({
        amount,
        orderId,
        customerName: formData.nama,
        email: formData.email
      });

      if (!paymentResult || !paymentResult.token) {
        throw new Error("Gagal mendapatkan token pembayaran. Hubungi admin.");
      }

      if (window.snap) {
        // Tutup modal pendaftaran agar overlay tidak menghalangi popup Midtrans
        onClose();
        
        window.snap.pay(paymentResult.token, {
          onSuccess: (result: any) => {
            Swal.fire({
              title: 'Pendaftaran Berhasil!',
              text: `Terima kasih ${formData.nama}, pendaftaran dan pembayaran telah selesai.`,
              icon: 'success',
              confirmButtonColor: '#1e8449',
            });
            setFormData({ nama: '', email: '', telepon: '', nisn: '', nik: '' });
            setFiles({ foto: null, ijazah: null, kk: null });
          },
          onPending: (result: any) => {
            Swal.fire({
              title: 'Menunggu Pembayaran',
              text: 'Silakan selesaikan pembayaran sesuai instruksi Midtrans.',
              icon: 'info',
              confirmButtonColor: '#1e8449',
            });
          },
          onError: (result: any) => {
            Swal.fire({
              title: 'Pembayaran Gagal',
              text: 'Terjadi kesalahan pada sistem pembayaran.',
              icon: 'error',
              confirmButtonColor: '#1e8449',
            });
          }
        });
      } else {
        throw new Error("Sistem pembayaran Midtrans gagal dimuat. Muat ulang halaman.");
      }

    } catch (error: any) {
      console.error("Submission Error:", error);
      Swal.fire({
        title: 'Pendaftaran Gagal',
        text: error.message || 'Terjadi kesalahan saat memproses data.',
        icon: 'error',
        confirmButtonColor: '#1e8449',
      });
    } finally {
      setLoading(false);
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
            Lengkapi data santri. Biaya pendaftaran sebesar Rp 50.000 akan diminta setelah formulir dikirim.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nama" className="flex items-center gap-2 text-foreground font-semibold">
                <i className="fas fa-user text-primary"></i> Nama Lengkap Santri <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="nama" 
                placeholder="Ibrahim Hassan" 
                className="h-12 border-2 focus:border-primary rounded-xl"
                value={formData.nama}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-foreground font-semibold">
                <i className="fas fa-envelope text-primary"></i> Email Orang Tua <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="email" 
                type="email"
                placeholder="email@contoh.com" 
                className="h-12 border-2 focus:border-primary rounded-xl"
                value={formData.email}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telepon" className="flex items-center gap-2 text-foreground font-semibold">
                <i className="fas fa-phone text-primary"></i> No. HP / WhatsApp <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="telepon" 
                placeholder="0812xxxxxx" 
                className="h-12 border-2 focus:border-primary rounded-xl"
                value={formData.telepon}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nisn" className="flex items-center gap-2 text-foreground font-semibold">
                <i className="fas fa-id-card text-primary"></i> NISN <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="nisn" 
                placeholder="10 digit angka" 
                className="h-12 border-2 focus:border-primary rounded-xl"
                value={formData.nisn}
                onChange={handleInputChange}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nik" className="flex items-center gap-2 text-foreground font-semibold">
                <i className="fas fa-id-card text-primary"></i> NIK <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="nik" 
                placeholder="16 digit angka" 
                className="h-12 border-2 focus:border-primary rounded-xl"
                value={formData.nik}
                onChange={handleInputChange}
                required 
              />
            </div>
          </div>

          <div className="space-y-5 bg-muted/30 p-6 rounded-2xl border border-dashed border-primary/20">
            <div className="space-y-2">
              <Label htmlFor="foto" className="flex items-center gap-2 text-foreground font-semibold">
                <i className="fas fa-camera text-primary"></i> Foto Santri (.jpg/.png) <span className="text-red-500">*</span>
              </Label>
              <Input id="foto" type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} className="bg-white border-2 rounded-xl" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ijazah" className="flex items-center gap-2 text-foreground font-semibold">
                <i className="fas fa-graduation-cap text-primary"></i> Ijazah (PDF) <span className="text-red-500">*</span>
              </Label>
              <Input id="ijazah" type="file" accept=".pdf" onChange={handleFileChange} className="bg-white border-2 rounded-xl" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="kk" className="flex items-center gap-2 text-foreground font-semibold">
                <i className="fas fa-users text-primary"></i> Kartu Keluarga (PDF) <span className="text-red-500">*</span>
              </Label>
              <Input id="kk" type="file" accept=".pdf" onChange={handleFileChange} className="bg-white border-2 rounded-xl" required />
            </div>
          </div>

          <DialogFooter>
            <Button 
              type="submit" 
              className={cn(
                "w-full h-14 text-lg font-bold rounded-xl shadow-lg transition-all hero-gradient hover:scale-[1.02]",
                loading && "opacity-80"
              )} 
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <i className="fas fa-spinner animate-spin"></i> Memproses...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <i className="fas fa-paper-plane"></i> Kirim & Bayar Sekarang
                </span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
