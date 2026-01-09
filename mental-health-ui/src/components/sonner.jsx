'use client';

import { Toaster as Sonner } from 'sonner';

const Toaster = ({ ...props }) => {
  // Using your specific color palette constants
  const colors = {
    bgCream: '#F9F7F2',
    textEspresso: '#2C241F',
    textMocha: '#5D4037',
    borderLatte: '#E6D5C3',
    whiteGlass: 'rgba(255, 255, 255, 0.95)',
  };

  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        style: {
          background: colors.whiteGlass,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${colors.borderLatte}`,
          color: colors.textEspresso,
          fontFamily: "'Inter', sans-serif",
          borderRadius: '16px',
          boxShadow: '0 10px 30px rgba(44, 36, 31, 0.1)',
        },
        // Custom styling for the description/subtitle text
        descriptionClassName: "toast-description",
      }}
      // This ensures the "Success" or "Error" icons fit your theme
      style={{
        '--normal-bg': colors.whiteGlass,
        '--normal-text': colors.textEspresso,
        '--normal-border': colors.borderLatte,
        '--success-text': '#435334', // A muted dark green that fits the cafe vibe
        '--error-text': '#BC4749',   // The red from your crisis button
      }}
      {...props}
    />
  );
};

export { Toaster };