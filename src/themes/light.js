const light = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // background: 'linear-gradient(145deg, #FFF5CC, #414427) no-repeat fixed',
          background: 'linear-gradient(145deg, rgba(239,239,247,1) 0%, rgba(171,171,191,1) 35%, rgba(20,20,23,1) 100%) no-repeat fixed',
        },
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      paper: '#ECEFF1',
    },
  },
};

export default light;