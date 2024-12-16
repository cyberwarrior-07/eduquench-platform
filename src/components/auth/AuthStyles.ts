export const authStyles = {
  theme: {
    default: {
      colors: {
        brand: '#FF4500',
        brandAccent: '#CC3700',
        inputBackground: 'white',
        inputBorder: 'hsl(var(--border))',
        inputBorderFocus: '#FF4500',
        inputBorderHover: '#FF4500',
      }
    }
  },
  style: {
    button: {
      background: '#FF4500',
      color: 'white',
      borderRadius: '0.5rem',
      height: '2.75rem',
      fontSize: '1rem',
      fontWeight: '500',
      border: 'none',
      cursor: 'pointer',
      width: '100%',
      padding: '0.75rem 1rem',
      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    },
    anchor: {
      color: '#FF4500',
      fontWeight: '500',
      textDecoration: 'none',
    },
    container: {
      width: '100%'
    },
    divider: {
      background: 'hsl(var(--border))',
      margin: '1.5rem 0'
    },
    input: {
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      backgroundColor: 'white',
      border: '1px solid hsl(var(--border))',
      fontSize: '1rem',
      width: '100%',
    },
    message: {
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      marginBottom: '1rem',
      fontSize: '0.925rem',
      backgroundColor: 'rgba(255, 69, 0, 0.1)',
      color: '#FF4500'
    },
    label: {
      color: 'hsl(var(--foreground))',
      marginBottom: '0.5rem',
      fontSize: '0.925rem',
      fontWeight: '500',
      display: 'block'
    }
  }
};