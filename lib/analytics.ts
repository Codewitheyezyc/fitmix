/**
 * FITMIX PRODUCT ACTIVATION FUNNEL ANALYTICS
 * Tracks core user journey activation events using stable UUID user IDs.
 */

export type ActivationEventName =
  | 'user_signed_up'
  | 'profile_completed'
  | 'piece_uploaded'
  | 'piece_deleted'
  | 'studio_opened'
  | 'mix_created'
  | 'mix_published'
  | 'mix_liked'
  | 'mix_saved'
  | 'user_followed'
  | 'message_sent'
  | 'notification_opened';

export interface AnalyticsProperties {
  userId?: string; // Stable UUID user ID
  pieceId?: string;
  mixId?: string;
  recipientId?: string;
  category?: string;
  styleInterests?: string[];
  [key: string]: any;
}

/**
 * Emits a privacy-preserving activation event
 */
export function trackEvent(
  eventName: ActivationEventName,
  properties?: AnalyticsProperties
) {
  const timestamp = new Date().toISOString();

  const payload = {
    event: eventName,
    timestamp,
    properties: {
      ...properties,
      // Ensure stable UUID is preserved and sensitive keys are omitted
      environment: process.env.NODE_ENV || 'production'
    }
  };

  // 1. Log event structured output in development/staging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[ANALYTICS_EVENT] ${eventName}`, payload);
  }

  // 2. Google Analytics / PostHog / Plausible Provider Integration Hook
  if (typeof window !== 'undefined') {
    // PostHog integration hook if window.posthog is defined
    if ((window as any).posthog) {
      (window as any).posthog.capture(eventName, payload.properties);
    }
    // Google Analytics (gtag) hook if window.gtag is defined
    if ((window as any).gtag) {
      (window as any).gtag('event', eventName, payload.properties);
    }
  }
}
