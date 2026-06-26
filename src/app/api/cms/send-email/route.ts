import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/mailer';
import { verifySession } from '@/lib/auth';
import { checkRateLimit, validateEmail } from '@/lib/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // 1. Auth check
    const sessionCookie = req.cookies.get('auth_session')?.value;
    const session = sessionCookie ? verifySession(sessionCookie) : null;
    
    if (!session || session.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    const rateLimit = checkRateLimit(`email_${ip}`, {
      maxRequests: 20,
      windowMs: 5 * 60 * 1000,
      blockDurationMs: 15 * 60 * 1000,
      maxRequestsPerDay: 100,
      dayMs: 24 * 60 * 60 * 1000,
    });
    if (!rateLimit.allowed) {
      return NextResponse.json({ error: rateLimit.message || 'Rate limit exceeded' }, { status: 429 });
    }

    // 3. Receive FormData
    const formData = await req.formData();
    const projectId = formData.get('projectId') as string;
    const emailType = formData.get('emailType') as string;
    const targetEmail = formData.get('targetEmail') as string;
    const ccEmail = formData.get('ccEmail') as string | null;
    const pdfFile = formData.get('pdfFile') as File | null;

    // 4. Input validation
    if (!projectId || !emailType || !targetEmail || !pdfFile) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const validateEmails = (emailsStr: string) => {
      const emails = emailsStr.split(',').map(e => e.trim()).filter(e => e);
      return emails.length > 0 && emails.every(validateEmail);
    };

    if (!validateEmails(targetEmail)) {
      return NextResponse.json({ error: 'Invalid target email format' }, { status: 400 });
    }

    if (ccEmail && !validateEmails(ccEmail)) {
      return NextResponse.json({ error: 'Invalid cc email format' }, { status: 400 });
    }

    if (emailType !== 'QUOTATION' && emailType !== 'INVOICE') {
      return NextResponse.json({ error: 'Invalid emailType' }, { status: 400 });
    }

    const project = await prisma.cmsProject.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const docTypeName = emailType === 'QUOTATION' ? 'Penawaran Harga (Quotation)' : 'Tagihan (Invoice)';
    const subject = `${emailType === 'INVOICE' ? 'Invoice' : 'Project Quotation'} - ${project.project_name || 'Project'}`;

    const wordingHtml = emailType === 'QUOTATION' 
      ? `
          <p>Menindaklanjuti komunikasi sebelumnya, bersama email ini kami lampirkan dokumen <strong>${docTypeName}</strong> terkait proyek <strong>${project.project_name}</strong> untuk dapat ditinjau lebih lanjut.</p>
          <p>Apabila ada hal yang perlu didiskusikan, atau jika terdapat penyesuaian yang diperlukan terkait detail penawaran tersebut, silakan menghubungi kami kembali melalui balasan email ini.</p>
          <p>Kami berharap dapat bekerja sama dengan <strong>${project.client_name}</strong> dalam proyek ini. Atas perhatian dan kesediaan waktunya, kami ucapkan terima kasih.</p>
        `
      : `
          <p>Bersama email ini kami lampirkan dokumen <strong>${docTypeName}</strong> terkait proyek <strong>${project.project_name}</strong>.</p>
          <p>Mohon kesediaannya untuk meninjau detail tagihan yang terlampir. Pembayaran dapat dilakukan sesuai dengan instruksi yang tertera pada dokumen tersebut. Jika ada hal yang kurang jelas atau pertanyaan lebih lanjut, silakan menghubungi kami kembali melalui balasan email ini.</p>
          <p>Atas perhatian dan kerja samanya, kami ucapkan terima kasih.</p>
        `;

    const emailBody = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #334155; line-height: 1.6; font-size: 15px; max-width: 800px; padding: 20px;">
        <!-- Body -->
        <div style="margin-bottom: 30px;">
          <p style="margin-top: 0;">Yth. Tim <strong>${project.client_name}</strong>,</p>
          <p>Semoga email ini menemui Anda dalam keadaan baik dan sehat.</p>
          ${wordingHtml}
        </div>
        
        <!-- Signature -->
        <div style="margin-bottom: 30px; margin-top: 40px;">
          <p style="margin: 0 0 16px; color: #64748b; font-size: 14px;">Best regards,</p>
          <table cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
            <tr>
              <td style="padding-right: 15px; border-right: 2px solid #2563eb; vertical-align: top;">
                <img src="https://nuralim.dev/personal-logo.png" alt="Nuralim" width="64" style="display: block; border-radius: 4px;" />
              </td>
              <td style="padding-left: 15px; vertical-align: top;">
                <p style="margin: 0 0 2px; font-weight: 800; font-size: 18px; color: #0f172a; letter-spacing: -0.5px;">Nuralim</p>
                <p style="margin: 0 0 10px; color: #3b82f6; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">Software Engineer</p>
                <table cellpadding="0" cellspacing="0" style="font-size: 13px;">
                  <tr>
                    <td style="padding-bottom: 3px; color: #94a3b8; padding-right: 8px; font-weight: 600;">W</td>
                    <td style="padding-bottom: 3px;"><a href="https://nuralim.dev" style="color: #475569; text-decoration: none; font-weight: 500;">nuralim.dev</a></td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 3px; color: #94a3b8; padding-right: 8px; font-weight: 600;">E</td>
                    <td style="padding-bottom: 3px;"><a href="mailto:halo@nuralim.dev" style="color: #475569; text-decoration: none; font-weight: 500;">halo@nuralim.dev</a></td>
                  </tr>
                  <tr>
                    <td style="padding-bottom: 3px; color: #94a3b8; padding-right: 8px; font-weight: 600;">M</td>
                    <td style="padding-bottom: 3px;"><a href="https://wa.me/628111441696" style="color: #475569; text-decoration: none; font-weight: 500;">+62 811-144-1696</a></td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
        
        <!-- Footer -->
        <div style="padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="margin: 0; color: #94a3b8; font-size: 12px;">Email ini dibuat secara otomatis dari sistem Nuralim.Dev. Dokumen asli terlampir di email ini.</p>
        </div>
      </div>
    `;

    // 5. Convert PDF file to buffer
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer());
    const attachmentFilename = pdfFile.name || `${emailType === 'QUOTATION' ? 'Quotation' : 'Invoice'}_${project.project_name.replace(/\s+/g, '_')}.pdf`;

    // 6. Send the email via SMTP
    await sendMail({
      to: targetEmail,
      cc: ccEmail || undefined,
      subject,
      html: emailBody,
      attachments: [
        {
          filename: attachmentFilename,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    return NextResponse.json({ success: true, message: 'Email sent successfully.' });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Internal server error while sending email' }, { status: 500 });
  }
}
