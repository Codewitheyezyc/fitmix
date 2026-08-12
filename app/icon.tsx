import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#0D0E12',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          fontWeight: 900,
          fontFamily: 'sans-serif',
          color: '#E2FF66',
          border: '1.5px solid rgba(226, 255, 102, 0.4)',
        }}
      >
        F<span style={{ color: '#E2FF66', fontSize: 18, marginLeft: -1 }}>.</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
