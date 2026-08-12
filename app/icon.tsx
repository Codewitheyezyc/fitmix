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
          background: '#0D0E12',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          fontFamily: 'sans-serif',
          border: '1.5px solid rgba(226, 255, 102, 0.5)',
          position: 'relative',
        }}
      >
        {/* The Signature Period in the V-dip of the M */}
        <div
          style={{
            position: 'absolute',
            top: '5px',
            right: '8px',
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            backgroundColor: '#E2FF66',
          }}
        />
        <div
          style={{
            fontSize: 14,
            fontWeight: 900,
            color: '#E2FF66',
            letterSpacing: '-0.5px',
            marginTop: '2px',
          }}
        >
          FM
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
