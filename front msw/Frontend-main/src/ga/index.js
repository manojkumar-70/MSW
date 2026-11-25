//Google Analytics GA4 setup
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (!GA_MEASUREMENT_ID) return;
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

export const trackPageView = (url) => {
  if (!GA_MEASUREMENT_ID) return;
  ReactGA.send({ hitType: 'pageview', page: url });
};

export const trackEvent = ({ action, category, label, value }) => {
  if (!GA_MEASUREMENT_ID) return;
  ReactGA.event({ action, category, label, value });
};
