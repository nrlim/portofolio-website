'use client';

import { motion } from 'framer-motion';
import { Award, Lock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { certifications } from '@/data/portfolio';
import Image from 'next/image';
import jsPDF from 'jspdf';
import { useState, useEffect } from 'react';

export function CertificationsSection() {
  const [apiKeyDialogOpen, setApiKeyDialogOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [selectedCert, setSelectedCert] = useState<{ id: string; imageUrl: string; title: string } | null>(null);
  const [error, setError] = useState('');
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'verifying' | 'success' | 'error'>('idle');

  // Protect against developer tools/inspect element access (client-side only)
  useEffect(() => {

    // Disable right-click on certificate images
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('[data-protected-image]')) {
        e.preventDefault();
        console.warn('Right-click is disabled on protected certificate images');
        return false;
      }
    };

    // Detect if DevTools is open and show warning
    const detectDevTools = () => {
      const threshold = 160;
      if (
        window.outerHeight - window.innerHeight > threshold ||
        window.outerWidth - window.innerWidth > threshold
      ) {
        console.warn(
          '🔒 Certificate images are protected. Downloading directly is not permitted. Use the official download button with API key instead.'
        );
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('resize', detectDevTools);
    
    // Run once on mount
    detectDevTools();

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('resize', detectDevTools);
    };
  }, []);

  const verifyAndDownload = async () => {
    try {
      setIsVerifying(true);
      setError('');
      setDownloadStatus('verifying');

      // Verify API key with backend
      const response = await fetch('/api/download-certificate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          certificateId: selectedCert?.id,
        }),
      });

      if (!response.ok) {
        setDownloadStatus('error');
        setError('Invalid API key. Please check and try again.');
        setIsVerifying(false);
        return;
      }

      // If verification successful, proceed with download
      setDownloadStatus('success');
      if (selectedCert) {
        await downloadImageAsPDF(selectedCert.imageUrl, selectedCert.title);
      }

      // Close dialog after successful download
      setTimeout(() => {
        setApiKeyDialogOpen(false);
        setApiKey('');
        setDownloadStatus('idle');
        setError('');
        setSelectedCert(null);
      }, 1000);
    } catch (error) {
      console.error('Verification error:', error);
      setDownloadStatus('error');
      setError('Failed to verify API key. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownloadClick = (certId: string, imageUrl: string, title: string) => {
    setSelectedCert({ id: certId, imageUrl, title });
    setApiKeyDialogOpen(true);
    setDownloadStatus('idle');
    setError('');
  };

  const downloadImageAsPDF = async (imageUrl: string, title: string) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const img = document.createElement('img') as HTMLImageElement;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imgData = canvas.toDataURL('image/png');
          
          const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
            unit: 'mm',
            format: [canvas.width * 0.264583, canvas.height * 0.264583],
          });

          pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
          pdf.save(`${title.replace(/\s+/g, '-')}.pdf`);
        }
      };
      img.src = URL.createObjectURL(blob);
    } catch (error) {
      console.error('Failed to download PDF:', error);
      alert('Failed to download certificate as PDF. Please try again.');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="certifications" className="py-20 px-4 md:px-8 lg:px-16" suppressHydrationWarning>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-8 h-8 text-blue-500" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
              Certification & Seminar
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Professional certifications yang memvalidasi expertise dan commitment terhadap continuous learning
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 flex items-center gap-1">
            <Lock className="w-3 h-3" /> Downloads protected by API key verification
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {certifications.map((cert) => (
            <motion.div
              key={cert.id}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-lg transition-shadow duration-300"
            >
              {/* Certificate Image */}
              {cert.certificateImage && (
                <div 
                  className="relative w-full h-80 bg-gray-100 dark:bg-gray-800 overflow-hidden flex items-center justify-center group select-none"
                  data-protected-image
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  style={{ userSelect: 'none' }}
                >
                  <Image
                    src={cert.certificateImage}
                    alt={cert.title}
                    fill
                    className="object-contain group-hover:scale-110 transition-transform duration-300 p-4 pointer-events-none"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    draggable={false}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      {cert.issuer}
                    </p>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {cert.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Download Buttons */}
                <div className="space-y-2">
                  {cert.certificateImage && (
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={() => handleDownloadClick(cert.id, cert.certificateImage, cert.title)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Download as PDF
                    </Button>
                  )}
                  {cert.certificatePDF && (
                    <Button
                      size="sm"
                      className="w-full"
                      variant="outline"
                      onClick={() => handleDownloadClick(cert.id, cert.certificatePDF!, cert.title)}
                    >
                      <Lock className="w-4 h-4 mr-2" />
                      Download PDF File
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 gap-4 mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-950">
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {certifications.length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total Certifications
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-950">
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {certifications.reduce((acc, cert) => acc + cert.skills.length, 0)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Skills Covered
            </p>
          </div>
        </motion.div>
      </div>

      {/* API Key Verification Dialog */}
      <Dialog open={apiKeyDialogOpen} onOpenChange={setApiKeyDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verify API Key</DialogTitle>
            <DialogDescription>
              Enter your API key to download this certificate. If you don&apos;t have one, please contact me.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="api-key" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                API Key
              </label>
              <Input
                id="api-key"
                type="password"
                placeholder="Enter your API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                disabled={isVerifying}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && apiKey.trim()) {
                    verifyAndDownload();
                  }
                }}
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            {downloadStatus === 'success' && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded text-sm text-green-700 dark:text-green-400">
                ✅ API key verified! Starting download...
              </div>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setApiKeyDialogOpen(false);
                  setApiKey('');
                  setError('');
                  setDownloadStatus('idle');
                }}
                disabled={isVerifying}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={verifyAndDownload}
                disabled={!apiKey.trim() || isVerifying}
                className="flex-1"
              >
                {isVerifying ? 'Verifying...' : 'Download'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
