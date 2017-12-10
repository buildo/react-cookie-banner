
const styles = {
  icon: {
    background: 'none',
    border: 'none',
    boxShadow: 'none',
    padding: '0',
    position: 'absolute',
    fontSize: '1em',
    top: '50%',
    marginTop: '-0.5em',
    right: '1em',
    color: 'white',
    cursor: 'pointer'
  },

  link: {
    color: '#F0F0F0',
    textDecoration: 'underline',
    marginLeft: '10px'
  },

  button: {
    position: 'absolute',
    top: '50%',
    right: '35px',
    lineHeight: '24px',
    marginTop: '-12px',
    padding: '0 8px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    border: 'none',
    borderRadius: '3px',
    boxShadow: 'none',
    fontSize: '12px',
    fontWeight: '500',
    color: '#242424',
    cursor: 'pointer'
  },

  message: {
    lineHeight: '45px',
    fontWeight: 500,
    color: '#F0F0F0'
  },

  banner: {
    position: 'relative',
    textAlign: 'center',
    backgroundColor: '#484848',
    width: '100%',
    height: '45px',
    zIndex: '10000'
  }
};

const getStyle = (style: 'message' | 'banner' | 'link' | 'button' | 'icon') => styles[style];

export { getStyle };
