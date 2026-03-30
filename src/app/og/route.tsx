import { ImageResponse } from 'next/og';
import { personalInfo, about } from '@/data/portfolio';

export const runtime = 'nodejs';

export async function GET(): Promise<Response> {
  try {
    // Fetch the profile photo if it's a URL
    let photoBuffer: ArrayBuffer | null = null;
    if (personalInfo.photo && personalInfo.photo.startsWith('http')) {
      try {
        const response = await fetch(personalInfo.photo);
        if (response.ok) {
          photoBuffer = await response.arrayBuffer();
        }
      } catch (error) {
        console.error('Failed to fetch profile photo:', error);
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
            background: 'linear-gradient(135deg, #0A84FF 0%, #00C2A8 100%)',
            padding: '60px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage:
                'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '50px 50px',
              opacity: 0.3,
            }}
          />

          {/* Left Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              position: 'relative',
              zIndex: 10,
              flex: 1,
              marginRight: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px',
              }}
            >
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 1.1,
                  letterSpacing: '-2px',
                }}
              >
                Nuralim
              </div>

              <div
                style={{
                  fontSize: '40px',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.95)',
                  lineHeight: 1.2,
                }}
              >
                Product &amp; Technology Development Manager
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                style={{
                  fontSize: '24px',
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.9)',
                }}
              >
                {about.metrics[0].value} Experience
              </div>

              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 500,
                  color: 'rgba(255,255,255,0.8)',
                }}
              >
                Building scalable software &amp; empowering teams
              </div>
            </div>
          </div>

          {/* Right - Profile Image */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              zIndex: 20,
            }}
          >
            <div
              style={{
                width: '280px',
                height: '280px',
                borderRadius: '20px',
                overflow: 'hidden',
                background: 'white',
                boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                border: '8px solid rgba(255,255,255,0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
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
                    fontSize: '120px',
                    fontWeight: 'bold',
                    color: 'white',
                  }}
                >
                  N
                </div>
              )}
            </div>
          </div>

          {/* Accent Elements */}
          <div
            style={{
              position: 'absolute',
              width: '300px',
              height: '300px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              top: '-100px',
              right: '-100px',
            }}
          />
          <div
            style={{
              position: 'absolute',
              width: '200px',
              height: '200px',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '50%',
              bottom: '-50px',
              left: '50px',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error(`${error}`);
    return new Response('Failed to generate image', {
      status: 500,
    });
  }
}
