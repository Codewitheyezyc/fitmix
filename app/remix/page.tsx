import React, { Suspense } from 'react';
import RemixCanvasEditor from '@/components/remix/RemixCanvasEditor';

export default function RemixPage() {
  return (
    <div className="min-h-screen">
      <Suspense fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#E2FF66] border-t-transparent rounded-full animate-spin" />
        </div>
      }>
        <RemixCanvasEditor />
      </Suspense>
    </div>
  );
}
