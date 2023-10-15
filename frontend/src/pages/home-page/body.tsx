import { BugReport, ChevronLeft, ChevronRight, ExpandLess, ExpandMore, GitHub, Public, ShieldOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Theme, Typography, useMediaQuery } from "@mui/material";
import { createRef, useEffect, useState } from "react";

function Preview() {
  const greaterThan1280 = useMediaQuery('(min-width:1280px)');

  const screenshotContext = require.context('./assets/screenshots', false, /\.(jpe?g|png|gif|svg|webp)$/);
  const screenshots = screenshotContext.keys().map(screenshotContext) as string[];

  const containerRef : React.RefObject<HTMLUListElement> = createRef();

  const onLeftClick = () => containerRef.current?.scrollBy({left: -200, behavior: 'smooth'});
  const onRightClick = () => containerRef.current?.scrollBy({left: 200, behavior: 'smooth'});

  const [isLeftVisible, toggleLeft] = useState(false);
  const [isRightVisible, toggleRight] = useState(true);

  useEffect(() => {
    if (containerRef.current) {
      toggleRight(Math.round(containerRef.current.scrollLeft + containerRef.current.offsetWidth) < Math.round(containerRef.current.scrollWidth));
    }

    const element = containerRef.current;
    const handleOnContainerScroll = () => {
      if (containerRef.current === null) return;
      toggleLeft(containerRef.current.scrollLeft > 0);
      toggleRight(Math.round(containerRef.current.scrollLeft + containerRef.current.offsetWidth) < Math.round(containerRef.current.scrollWidth));
    }

    element?.addEventListener("scroll", handleOnContainerScroll);
    return () => element?.removeEventListener("scroll", handleOnContainerScroll);
  }, [containerRef]);

  const scrollButtonContainerStyle = {
    position: 'absolute',
    height: '100%',
    top: 0,
    display: 'flex',
    alignItems: 'center',
  };

  const scrollButtonStyle = (theme : Theme) => ({
    borderRadius: 30,
    padding: 1,
    aspectRatio: 1,
    backgroundColor: theme.palette.grey[800],
    '&:hover': {
      backgroundColor: theme.palette.grey[900],
    }
  });

  return (
    <Box sx={{position: 'relative'}}>
      <Box sx={{overflow: 'auto', '&::-webkit-scrollbar': { display: 'none' }}} ref={containerRef}>
        <Box sx={{
          paddingTop: 1,
          paddingBottom: 1,
          display: 'flex',
          height: greaterThan1280 ? '325px' : '225px',
        }} gap={2} ref={containerRef}>
          {screenshots.map((s, i) => (
            <Box key={i} sx={{borderRadius: 8, boxShadow: 5, height: '100%'}}>
              <img alt="Application Preview" src={s} style={{borderRadius: 8, height: '100%'}} />
            </Box>
          ))}
        </Box>
      </Box>
      {isLeftVisible && <Box sx={{left: 0, transform: 'translate(-50%, 0)', ...scrollButtonContainerStyle}}>
        <Button onClick={onLeftClick} size="large" variant="contained" sx={scrollButtonStyle}>
          <ChevronLeft sx={{fontSize: 35}} />
        </Button>
      </Box>}
      {isRightVisible && <Box sx={{right: 0, transform: 'translate(50%, 0)', ...scrollButtonContainerStyle}}>
        <Button onClick={onRightClick} size="large" variant="contained" sx={scrollButtonStyle}>
          <ChevronRight sx={{fontSize: 35}} />
        </Button>
      </Box>}
    </Box>
  );
}

interface SideLinkProps {
  children: React.ReactNode;
  startIcon: React.ReactNode;
  href: string|null;
}

function SideLink(props: SideLinkProps) {
  if (props.href == null) return <></>;

  return (
    <a href={props.href} target="_blank" rel="noreferrer">
      <Button 
        sx={{
          textTransform: 'none',
          justifyContent: 'start',
          color: 'text.primary',
        }}
        startIcon={props.startIcon}
        fullWidth
      >
        {props.children}
      </Button>
    </a>
  );
}

interface SideItemProps {
  name: React.ReactNode;
  value: React.ReactNode;
}

function SideItem(props: SideItemProps) {

  return (
    <>
      <Typography variant="body1" fontWeight="bold" mt={2}>{props.name}</Typography>
      <Typography variant="body1">{props.value}</Typography>
    </>
  );
}

function Body() {
  const greaterThan960 = useMediaQuery('(min-width:960px)');
  const greaterThan600 = useMediaQuery('(min-width:600px)');

  const [isAppSupportOpen, toggleAppSupport] = useState(false);

  return (
    <Box sx={{
      mt: greaterThan600 ? 8 : 4,
      display: greaterThan960 ? 'flex' : 'block',
      gap: 5,
    }}>
      <Box sx={{ flex: 1, width: greaterThan960 ? '0' : '100%' }}>
        <Preview />
        <Typography variant="h5" mt={greaterThan600 ? 5 : 3}>About this app</Typography>
        <Typography variant="body1" mt={2}>{window.siteConfiguration.application.description}</Typography>
      </Box>
      <Box sx={{ width: greaterThan960 ? '300px' : '100%' }}>
        <Box sx={{display: 'flex', alignItems: 'center',  mt: greaterThan960 ? 0 : 5}}>
          <Typography variant="h5">App support</Typography>
          <IconButton sx={{ml: 2}} onClick={() => toggleAppSupport(!isAppSupportOpen)}>
            {isAppSupportOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        </Box>
        {isAppSupportOpen && <Stack spacing={1} mt={1}>
          <SideLink startIcon={<Public />} href={window.siteConfiguration.application.website}>Website</SideLink>
          <SideLink startIcon={<GitHub />} href={`https://github.com/${window.siteConfiguration.application.github}`}>GitHub Repository</SideLink>
          <SideLink startIcon={<BugReport />} href={window.siteConfiguration.application.bugs}>Report a Bug</SideLink>
          <SideLink startIcon={<ShieldOutlined />} href="/privacy-policy">Privacy Policy</SideLink>
        </Stack>}
        <Typography variant="h5" mt={5}>App info</Typography>
        <Stack>
          <SideItem name="Requires" value={window.siteConfiguration.application.info.minimumRequirement ?? 'No requirements'} />
          <SideItem name="Updated on" value={window.siteConfiguration.application.info.updatedOn} />
          <SideItem name="Released on" value={window.siteConfiguration.application.info.releasedOn} />
        </Stack>
      </Box>
    </Box>
  );
}

export default Body;
