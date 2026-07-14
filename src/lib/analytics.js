const provider = {
  track(eventName, properties) {
    if (typeof window === "undefined") return;

    // Future Plausible/PostHog adapters belong here. Never pass player names.
    if (import.meta.env.DEV) {
      console.info("[analytics]", eventName, properties || {});
    }
  },
};

export function trackEvent(eventName, properties = {}) {
  const safeProperties = Object.fromEntries(
    Object.entries(properties).filter(([key]) => !/name|answer|text/i.test(key)),
  );
  provider.track(eventName, safeProperties);
}
