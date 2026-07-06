import React from 'react';
import AppRoutes from './AppRoutes';
import OAuthRedirectHandler from './components/OAuthRedirectHandler';
import './index.css';

export default function App() {
  return (
    <>
      <OAuthRedirectHandler />
      <AppRoutes />
    </>
  );
}