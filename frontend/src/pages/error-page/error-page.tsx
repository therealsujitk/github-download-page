import { Box, Link, Typography, useMediaQuery } from '@mui/material';

interface PageNotFoundProps {
  error: number;
}

function PageNotFound(props: PageNotFoundProps) {
  const greaterThan1000 = useMediaQuery('(min-width:1000px)');
  const greaterThan850 = useMediaQuery('(min-width:850px)');
  const greaterThan650 = useMediaQuery('(min-width:650px)');

  return (
    <Box sx={{p: greaterThan850 ? 15 : greaterThan650 ? 10 : 5, width: greaterThan1000 ? '850px' : '100%'}}>
      <Typography variant="h4" fontWeight="bold">
        { props.error === 404 ? "404 Page Not Found" :
          props.error === 500 ? "500 Internal Server Error" : props.error + " An Error Occurred"
        }
      </Typography>
      <Typography variant="body1" mt={3} mb={3}>
        { props.error === 404 ? "The page you were looking for could not be found! Looks like you might have found a broken link. If you clicked a link, please go back to the previous page. If you entered the URL manually, please double check what you've entered." :
          props.error === 500 ? "Sorry, something went wrong on our end. Please try again later or go back to the previous page. If this issue is still not resolved, kindly open an report it using the link below." : "Sorry, something went wrong when we tried to load this page."
        }
      </Typography>
      <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
        <Link href={`${process.env.PUBLIC_URL}${window.siteConfiguration.site.basePath ?? '/'}`} underline="none">{'< Go Home'}</Link>
        <Link href={window.siteConfiguration.application.bugs ?? `https://github.com/${window.siteConfiguration.application.github}/issues`} underline="none">{'Report a Bug >'}</Link>
      </Box>
    </Box>
  );
}

export default PageNotFound;
