import { NextRequest, NextResponse } from 'next/server';
import { personalInfo } from '@/data/portfolio';
import {
  checkRateLimit,
  getClientIdentifier,
  detectSpamContent,
  validateEmail,
} from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
    try {
        // Get client IP/identifier
        const clientId = getClientIdentifier(req);

        // Check rate limit
        const rateLimitResult = checkRateLimit(clientId);
        if (!rateLimitResult.allowed) {
            console.warn(`Rate limit exceeded for IP: ${clientId}`);
            return NextResponse.json(
                {
                    error: rateLimitResult.message || 'Terlalu banyak percobaan. Silakan coba lagi nanti.',
                    resetTime: rateLimitResult.resetTime,
                },
                { status: 429 } // Too Many Requests
            );
        }

        const body = await req.json();
        const { name, email, company, message, honeypot } = body;

        // Anti-spam: Check honeypot
        if (honeypot) {
            console.warn(`Honeypot triggered from IP: ${clientId}`);
            return NextResponse.json(
                { error: 'Spam detected' },
                { status: 400 }
            );
        }

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: 'Nama, email, dan pesan wajib diisi' },
                { status: 400 }
            );
        }

        // Enhanced email validation
        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: 'Email tidak valid atau menggunakan layanan email sementara' },
                { status: 400 }
            );
        }

        // Content-based spam detection
        if (detectSpamContent({ name, email, message })) {
            console.warn(`Spam content detected from IP: ${clientId}, Email: ${email}`);
            return NextResponse.json(
                { error: 'Pesan terdeteksi sebagai spam. Silakan gunakan konten yang valid.' },
                { status: 400 }
            );
        }

        // Prepare email content
        const emailSubject = `[Portfolio Contact] Pesan dari ${name}`;
        const emailBody = `
                Nama: ${name}
                Email: ${email}
                Perusahaan: ${company || '-'}

                Pesan:
                ${message}

                ---
                Email ini dikirim melalui form kontak di portfolio website.`.trim();

        // Option 1: Using Web3Forms (Free, No API key needed for basic usage)
        const web3formsResponse = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                access_key: process.env.WEB3FORMS_ACCESS_KEY || '',
                subject: emailSubject,
                from_name: name,
                email: email,
                message: emailBody,
                to_email: personalInfo.email,
            }),
        });

        if (!web3formsResponse.ok) {
            // Fallback: Create mailto link as response
            const mailtoLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

            return NextResponse.json({
                success: false,
                fallback: true,
                mailtoLink,
                message: 'Tidak dapat mengirim email otomatis. Silakan gunakan link email manual.',
            });
        }

        return NextResponse.json({
            success: true,
            message: 'Pesan berhasil terkirim! Terima kasih.',
        });

    } catch (error) {
        console.error('Error sending email:', error);

        // Fallback response
        const mailtoLink = `mailto:${personalInfo.email}?subject=Pesan dari Portfolio&body=`;

        return NextResponse.json({
            success: false,
            fallback: true,
            mailtoLink,
            message: 'Terjadi kesalahan. Silakan hubungi via email langsung.',
        }, { status: 500 });
    }
}
