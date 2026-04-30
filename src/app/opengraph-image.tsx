import fs from 'fs';
import path from 'path';
import { ImageResponse } from 'next/og';
import { personalInfo, about } from '@/data/portfolio';

export const runtime = 'nodejs';

export const alt = 'Nuralim - Product & Technology Development Manager';
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
  try {
    let photoBuffer: ArrayBuffer | null = null;

    // Handle profile photo
    if (personalInfo.photo) {
      try {
        if (personalInfo.photo.startsWith('http')) {
          const response = await fetch(personalInfo.photo);
          if (response.ok) {
            photoBuffer = await response.arrayBuffer();
          }
        } else {
          const filePath = path.join(process.cwd(), 'public', personalInfo.photo);
          if (fs.existsSync(filePath)) {
            const fileData = fs.readFileSync(filePath);
            photoBuffer = fileData.buffer.slice(
              fileData.byteOffset,
              fileData.byteOffset + fileData.byteLength
            ) as ArrayBuffer;
          }
        }
      } catch (error) {
        console.error('Failed to load profile photo for OG:', error);
      }
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%',
            height: '100%',
            background: '#09090b', // Dark obsidian theme
            padding: '80px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative Mesh Gradient Background */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '120%',
              height: '120%',
              background: 'radial-gradient(circle at 10% 20%, rgba(10, 132, 255, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(0, 194, 168, 0.15) 0%, transparent 40%)',
              opacity: 0.8,
              display: 'flex',
            }}
          />

          {/* Abstract Grid Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              display: 'flex',
            }}
          />

          {/* Main Content Area */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              height: '100%',
              position: 'relative',
              zIndex: 10,
              flex: 1,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '20px',
              }}
            >
              <div style={{ width: '40px', height: '4px', background: '#0A84FF', borderRadius: '2px', display: 'flex' }} />
              <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '20px', fontWeight: 600, letterSpacing: '4px', display: 'flex' }}>
                PORTFOLIO
              </div>
            </div>

            <div
              style={{
                fontSize: '84px',
                fontWeight: 900,
                color: 'white',
                lineHeight: 1,
                letterSpacing: '-3px',
                marginBottom: '16px',
                display: 'flex',
              }}
            >
              {personalInfo.name}
            </div>

            <div
              style={{
                fontSize: '32px',
                fontWeight: 500,
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '40px',
                maxWidth: '600px',
                display: 'flex',
              }}
            >
              {personalInfo.title}
            </div>

            {/* Experience Badge */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '12px 24px',
                borderRadius: '100px',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <div style={{ width: '8px', height: '8px', background: '#00C2A8', borderRadius: '50%', display: 'flex' }} />
              <div style={{ color: 'white', fontSize: '20px', fontWeight: 600, display: 'flex' }}>
                {about.metrics[0].value} Professional Experience
              </div>
            </div>
          </div>

          {/* Right Column - Profile & branding */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: '320px',
                height: '320px',
                borderRadius: '32px',
                overflow: 'hidden',
                background: '#1c1c1e',
                boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}
            >
              {photoBuffer ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={`data:image/jpeg;base64,${Buffer.from(photoBuffer).toString('base64')}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  alt="Profile"
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #0A84FF 0%, #00C2A8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '140px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  {personalInfo.name.charAt(0)}
                </div>
              )}
            </div>
            
            <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '18px', fontWeight: 500, display: 'flex' }}>
              nuralim.dev
            </div>
          </div>
        </div>
      ),

      {
        ...size,
      }
    );
  } catch (error) {
    console.error(`OG Generation Error: ${error}`);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}

