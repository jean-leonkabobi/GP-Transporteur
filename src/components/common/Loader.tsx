// components/common/Loader.tsx
export function Loader({ fullScreen = false, size = 'md' }: { fullScreen?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 24,
    md: 40,
    lg: 56,
  };

  const spinnerSize = sizes[size];

  const spinner = (
    <div style={{
      display: 'inline-block',
      width: spinnerSize,
      height: spinnerSize,
      border: `3px solid ${fullScreen ? 'rgba(37,99,235,0.2)' : '#e2e8f0'}`,
      borderTopColor: '#2563eb',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
  );

  if (fullScreen) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(255,255,255,0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}>
        {spinner}
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px',
    }}>
      {spinner}
    </div>
  );
}