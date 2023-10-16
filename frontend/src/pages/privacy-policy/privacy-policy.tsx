import { Box, Link, Typography, useMediaQuery } from '@mui/material';
import Data from './data.json';
import Markdown, { Components } from 'react-markdown';

function PrivacyPolicy() {
  const greaterThan1000 = useMediaQuery('(min-width:1000px)');
  const greaterThan850 = useMediaQuery('(min-width:850px)');
  const greaterThan650 = useMediaQuery('(min-width:650px)');
  const mdComponents: Components = {
    a: ({children, href}) => <Link href={href}>{children}</Link>,
    p: ({children}) => <Typography variant="body1" mt={1}>{children}</Typography>,
    li: ({children}) => <li><Typography variant="body1">{children}</Typography></li>,
    h1: ({children}) => <Typography variant="h1" mt={3}>{children}</Typography>,
    h2: ({children}) => <Typography variant="h2" mt={3}>{children}</Typography>,
    h3: ({children}) => <Typography variant="h3" mt={2}>{children}</Typography>,
    h4: ({children}) => <Typography variant="h4" mt={2}>{children}</Typography>,
    h5: ({children}) => <Typography variant="h5" mt={1}>{children}</Typography>,
    h6: ({children}) => <Typography variant="h6" mt={1}>{children}</Typography>,
    text: ({children}) => <Typography variant="body1" mt={1}>{children}</Typography>,
  };

  return (
    <Box sx={{margin: 'auto', p: greaterThan850 ? 15 : greaterThan650 ? 10 : 5, width: greaterThan1000 ? '950px' : '100%'}}>
      <Typography variant="h3" fontWeight="bold">Privacy Policy</Typography>
      <Typography variant="body1" mt={3}>Last updated: <b>{Data.lastUpdated}</b></Typography>
      <Typography variant="body1" mt={1}>This Privacy Policy describes the policies and procedures on the collection, use and disclosure of your information when you use this service.</Typography>
      {
        Data.body.map((el, i) => (
          <Box key={i}>
            <Typography variant="h4" mt={3}>{el.heading}</Typography>
            {el.content.map((c, i) => <Markdown key={i} components={mdComponents}>{c}</Markdown>)}
          </Box>
        ))
      }
    </Box>
  );
}

export default PrivacyPolicy;
