import React from 'react';
import AppRoutes from './AppRoutes';
import OAuthRedirectHandler from './components/OAuthRedirectHandler';
import GlobalHeaderBanner from './components/GlobalHeaderBanner';
import './index.css';

export default function App() {
  return (
    <>
      <GlobalHeaderBanner />
      <OAuthRedirectHandler />
      <AppRoutes />
    </>
  );
}