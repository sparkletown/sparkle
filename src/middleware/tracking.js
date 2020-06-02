export default function trackingMiddleware(analytics) {
  return (store) => (next) => (action) => {
    if (action.type === "@@router/LOCATION_CHANGE") {
      const nextPage = `${action.payload.pathname}${action.payload.search}`;
      analytics.logEvent("pageview", nextPage, action);
    } else {
      analytics.logEvent("event", action);
    }
    return next(action);
  };
}
