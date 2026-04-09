// components/common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  icon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const variants = {
    primary: { bg: '#2563eb', hover: '#1d4ed8', color: '#fff', border: 'none' },
    secondary: { bg: '#f1f5f9', hover: '#e2e8f0', color: '#374151', border: 'none' },
    outline: { bg: 'transparent', hover: '#f8fafc', color: '#2563eb', border: '1.5px solid #2563eb' },
    danger: { bg: '#dc2626', hover: '#b91c1c', color: '#fff', border: 'none' },
    success: { bg: '#16a34a', hover: '#15803d', color: '#fff', border: 'none' },
  };

  const sizes = {
    sm: { padding: '6px 12px', fontSize: '12px' },
    md: { padding: '9px 16px', fontSize: '13px' },
    lg: { padding: '12px 24px', fontSize: '15px' },
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <button
      disabled={disabled || loading}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: variantStyle.bg,
        color: variantStyle.color,
        border: variantStyle.border,
        borderRadius: '9px',
        fontWeight: 600,
        cursor: (disabled || loading) ? 'not-allowed' : 'pointer',
        opacity: (disabled || loading) ? 0.6 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'all 0.15s',
        ...sizeStyle,
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = variantStyle.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.currentTarget.style.background = variantStyle.bg;
        }
      }}
      {...props}
    >
      {loading && (
        <div style={{
          width: '14px',
          height: '14px',
          border: '2px solid rgba(255,255,255,0.4)',
          borderTopColor: '#fff',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
      )}
      {icon && !loading && <span>{icon}</span>}
      {children}
    </button>
  );
}