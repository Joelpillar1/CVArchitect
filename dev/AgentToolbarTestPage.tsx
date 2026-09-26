import React from 'react';
import ResumeAgentPage from '../pages/ResumeAgentPage';

/** DEV HARNESS — renders the exact /agent hero embed (2/3-viewport frame) for
 *  verifying the embedded workspace layout (toolbar fit, canvas, chat panel)
 *  without needing a signed-in session. Remove before shipping. */
export default function AgentToolbarTestPage() {
  return (
    <div className="min-h-screen bg-brand-bg font-sans">
      {/* Exact hero embed geometry: 2/3 viewport frame */}
      <div className="w-[calc(100vw*(2/3))] mx-auto">
        <ResumeAgentPage embedded />
      </div>
    </div>
  );
}
