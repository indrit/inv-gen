export const GA_TRACKING_ID = 'G-C3PJRS5J0T';
export const AW_TRACKING_ID = 'AW-17986047423';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }: { action: string, category: string, label: string, value?: number }) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Google Ads Conversion tracking
export const conversion = (send_to: string) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'conversion', {
            'send_to': send_to
        });
    }
};
