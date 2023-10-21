import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HomePage, ErrorPage, PrivacyPolicy } from './pages';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

if (!window.siteConfiguration) {
  window.siteConfiguration = {
    application: {
      name: "Material Components Catalog",
      description: "This is a download page for your GitHub project inspired by Google Play Store. As an example I have used the material components for android catalog app to showcase this site. Click the GitHub link in the navigation bar to get your own copy.",
      github: "material-components/material-components-android",
      info: {
        releasedOn: new Date(2018, 10, 15),
        releasedOnString: "Nov 15, 2018",
      }
    },
    developer: {
      name: "Google LLC",
      website: "https://android.com"
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
      ],
      statusCode: 200,
      basePath: '/',
    },
    privacyPolicy: {
      lastUpdated: new Date(2023, 9, 16),
      lastUpdatedString: "October 16, 2023",
      body: [
        {
          "heading": "About this service",
          "content": [
            "This service contains no ads whatsoever and is completely free of cost and open source. If you feel like supporting me, you can always leave a donation at [https://therealsuji.tk/donate](https://therealsuji.tk/donate)."
          ]
        },
        {
          "heading": "Contact us",
          "content": [
            "If you have any questions about this Privacy Policy, You can contact me:",
            "- By email: [me@example.com](mailto:me@example.com)\n- By visiting this page on our website: [https://example.com](https://example.com)"
          ]
        }
      ]
    },
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
      {
        window.siteConfiguration.site.statusCode === 200
        ? <BrowserRouter basename={window.siteConfiguration.site.basePath}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/*" element={<ErrorPage error={404} />} />
            </Routes>
          </BrowserRouter>
        : <ErrorPage error={window.siteConfiguration.site.statusCode ?? 500} />
      }
    </ThemeProvider>
  );
}

export default App;
