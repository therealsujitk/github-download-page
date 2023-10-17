import { AppBar, Avatar, Box, Link, Stack, Toolbar, useMediaQuery } from '@mui/material';
import Header from './header';
import Body from './body';
import developerIcon from './assets/developer-icon.png';
import { useEffect, useState } from 'react';

function HomePage() {
  const greaterThan600 = useMediaQuery('(min-width:600px)');
  const greaterThan1280 = useMediaQuery('(min-width:1280px)');

  const paddingHorizontal = () => {
    if (greaterThan1280) {
      return 15;
    } else if (greaterThan600) {
      return 8;
    }

    return 3;
  }

  const [appBarElevation, setAppBarElevation] = useState(0);

  useEffect(() => {
    const handleOnScroll = () => {
      if (window.scrollY === 0) setAppBarElevation(0);
      else setAppBarElevation(10);
    }

    window.addEventListener("scroll", handleOnScroll);
    return () => window.removeEventListener("scroll", handleOnScroll);
  }, []);

  return (
    <Box sx={{overflow: 'hidden'}}>
      <AppBar position="fixed" elevation={appBarElevation} sx={{backgroundImage: 'none', borderRadius: 0}}>
        <Toolbar>
          <Avatar alt={window.siteConfiguration.developer.name} src={window.siteConfiguration.developer.logo ?? developerIcon} sx={{mr: 4}} />
          <Stack direction="row" spacing={2} alignItems="center">
            {window.siteConfiguration.site.links && window.siteConfiguration.site.links.map((l, i) => <Link key={i} href={l.href} underline="hover">{l.name}</Link>)}
          </Stack>
        </Toolbar>
      </AppBar>
      <Box sx={{margin: 'auto', maxWidth: '1500px', pl: paddingHorizontal(), pt: greaterThan600 ? 15 : 10, pr: paddingHorizontal(), pb: 7}}>
        <Header />
        <Body />
      </Box>
    </Box>
  );
}

export default HomePage;
