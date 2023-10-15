import { HomePage } from './pages';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

if (!window.siteConfiguration) {
  window.siteConfiguration = {
    application: {
      name: "Application Name",
      versionName: "v1.0.0",
      downloads: 0,
      size: 0,
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      website: "https://github.com/therealsujitk/github-download-page",
      github: "therealsujitk/github-download-page",
      bugs: "https://github.com/therealsujitk/github-download-page",
      info: {
        minimumRequirement: null,
        releasedOn: "Jan 1, 1970",
        updatedOn: "Jan 1, 1970",
      }
    },
    developer: {
      name: "Developer Name",
      logo: null,
      website: "#"
    },
    site: {
      primaryColor: "#03875F",
      links: [
        {
          name: "Developer",
          href: "https://therealsuji.tk"
        },
        {
          name: "GitHub",
          href: "https://github.com/therealsujitk/github-download-page"
        },
        {
          name: "Donate",
          href: "https://therealsuji.tk/donate"
        }
      ]
    }
  };
}

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {main: window.siteConfiguration.site.primaryColor},
  },
  typography: {
    fontFamily: [
      'Rubik',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '7px',
          fontWeight: 'bold',
          padding: '10px 20px',
          textAlign: 'left',
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '7px',
        }
      }
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HomePage />
    </ThemeProvider>
  );
}

export default App;
