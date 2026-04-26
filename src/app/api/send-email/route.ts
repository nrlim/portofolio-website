import { NextRequest, NextResponse } from 'next/server';
import { personalInfo } from '@/data/portfolio';
import { Resend } from 'resend';
import {
    checkRateLimit,
    getClientIdentifier,
    detectSpamContent,
    validateEmail,
} from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

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
        const emailSubject = `[Portfolio] Pesan Baru dari ${name}${company ? ` (${company})` : ''}`;

        // Plain text version (fallback)
        const emailText = `
Nama: ${name}
Email: ${email}
Perusahaan: ${company || '-'}

Pesan:
${message}

---
Email ini dikirim melalui form kontak di portfolio website.`.trim();

        // Professional HTML version
        const emailHtml = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb;">
                <div style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 32px 24px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.025em;">Pesan Portfolio Baru</h1>
                    <p style="color: #94a3b8; margin-top: 8px; font-size: 14px;">Seseorang tertarik untuk berkolaborasi dengan Anda</p>
                </div>
                
                <div style="padding: 32px 24px; background-color: #ffffff;">
                    <div style="margin-bottom: 24px;">
                        <h2 style="font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">Informasi Pengirim</h2>
                        <table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border-collapse: collapse; border: none;">
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; width: 110px; font-size: 14px; vertical-align: top;">Nama</td>
                                <td style="padding: 8px 0; color: #64748b; width: 20px; font-size: 14px; vertical-align: top;">:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-weight: 600; font-size: 14px; vertical-align: top;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; width: 110px; font-size: 14px; vertical-align: top;">Email</td>
                                <td style="padding: 8px 0; color: #64748b; width: 20px; font-size: 14px; vertical-align: top;">:</td>
                                <td style="padding: 8px 0; font-size: 14px; vertical-align: top;"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none; font-weight: 600;">${email}</a></td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; width: 110px; font-size: 14px; vertical-align: top;">Perusahaan</td>
                                <td style="padding: 8px 0; color: #64748b; width: 20px; font-size: 14px; vertical-align: top;">:</td>
                                <td style="padding: 8px 0; color: #1e293b; font-size: 14px; vertical-align: top;">${company || '<i style="color: #94a3b8;">Tidak disebutkan</i>'}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <div style="margin-bottom: 32px;">
                        <h2 style="font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.05em; margin-bottom: 12px; border-bottom: 1px solid #f1f5f9; padding-bottom: 8px;">Isi Pesan</h2>
                        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; color: #334155; font-size: 15px; line-height: 1.6; border-left: 4px solid #3b82f6;">
                            ${message.replace(/\n/g, '<br/>')}
                        </div>
                    </div>
                    
                    <div style="text-align: center;">
                        <a href="mailto:${email}" style="display: inline-block; background-color: #0f172a; color: #ffffff; padding: 12px 32px; border-radius: 6px; font-weight: 600; text-decoration: none; font-size: 14px;">Balas Sekarang</a>
                    </div>
                </div>
                
                <div style="padding: 24px; background-color: #f1f5f9; text-align: center; border-top: 1px solid #e5e7eb;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px;">Email ini dikirim otomatis dari sistem portfolio Anda.</p>
                    <p style="margin: 4px 0 0 0; color: #94a3b8; font-size: 12px;">© ${new Date().getFullYear()} Nuralim Portfolio</p>
                </div>
            </div>
        `;

        // Option 2: Using Resend (Professional)
        const { data: _data, error: resendError } = await resend.emails.send({
            from: 'System <system@nuralim.dev>',
            to: [personalInfo.email],
            subject: emailSubject,
            html: emailHtml,
            text: emailText,
            replyTo: email,
        });

        if (resendError) {
            console.error('Resend error:', resendError);
            // Fallback: Create mailto link as response
            const mailtoLink = `mailto:${personalInfo.email}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailText)}`;

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
