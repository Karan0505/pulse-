import React from 'react';
import Link from 'next/link';

export default function Custom500() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#090d16',
      color: '#f3f4f6',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '6rem', margin: '0', color: '#ef4444', fontWeight: '800' }}>500</h1>
      <h2 style={{ fontSize: '1.875rem', marginTop: '1rem', fontWeight: '600' }}>Internal Server Error</h2>
      <p style={{ color: '#9ca3af', maxWidth: '400px', marginTop: '0.5rem', marginBottom: '2rem' }}>
        Something went wrong on our end. Please try refreshing the page or head back to the dashboard.
      </p>
      <Link 
        href="/"
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'background-color 0.2s'
        }}
      >
        Return to Home
      </Link>
    </div>
  );
}
