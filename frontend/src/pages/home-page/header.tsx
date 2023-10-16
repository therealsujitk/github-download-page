import { Close, ContentCopy, Email, Share } from "@mui/icons-material";
import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Divider, IconButton, Link, Stack, TextField, Typography, useMediaQuery } from "@mui/material";
import logo from './assets/logo.png';
import xSocial from './assets/social/x.jpg';
import facebookSocial from './assets/social/facebook.png';
import whatsappSocial from './assets/social/whatsapp.png';
import React, { useState } from "react";

interface InfoItemProps {
  name: React.ReactNode;
  value: React.ReactNode;
}

function InfoItem(props: InfoItemProps) {
  return (
    <Stack textAlign="center">
      <Typography variant="subtitle1" fontWeight="bold">{props.value}</Typography>
      <Typography variant="caption" color="grey.500">{props.name}</Typography>
    </Stack>
  );
}

interface ShareButtonProps {
  name: string;
  image: string|React.ReactNode;
  onClick: () => void;
}

function ShareButton(props: ShareButtonProps) {
  return (
    <Stack alignItems="center" spacing={0.5} onClick={props.onClick} sx={{'&:hover': {cursor: 'pointer'}}}>
      {typeof props.image == 'string'
        ? <Avatar sx={{ width: 56, height: 56 }} src={props.image} />
        : <Avatar sx={{ width: 56, height: 56 }}>{props.image}</Avatar>
      }
      <Typography variant="subtitle2">{props.name}</Typography>
    </Stack>
  );
}

interface ShareDialogProps {
  isOpened: boolean;
  onClose: () => void;
}

function ShareDialog(props: ShareDialogProps) {
  const shareX = () => {
    const url = new URL('https://twitter.com/intent/tweet');
    url.searchParams.append("url", window.location.href);
    url.searchParams.append("text", `Check out "${window.siteConfiguration.application.name}"`);

    window.open(url, '_blank')?.focus();
  }

  const shareFacebook = () => {
    const url = new URL('https://www.facebook.com/sharer/sharer.php');
    url.searchParams.append("u", window.location.href);

    window.open(url, '_blank')?.focus();
  }

  const shareWhatsApp = () => {
    const url = new URL('https://api.whatsapp.com/send');
    url.searchParams.append("text", window.location.href);
    url.searchParams.append("type", 'custom_url');

    window.open(url, '_blank')?.focus();
  }

  const shareEmail = () => {
    const url = new URL('mailto:');
    url.searchParams.append("subject", `Check out "${window.siteConfiguration.application.name}"`);
    url.searchParams.append("body", window.location.href);

    window.open(url, '_self')?.focus();
  }

  return (
    <Dialog maxWidth="sm" fullWidth open={props.isOpened} onClose={props.onClose}>
      <DialogTitle>
        <Box sx={{display: 'flex', gap: 2, mt: 1}}>
          <Box sx={{width: '60px', height: '60px', borderRadius: '8px', boxShadow: 5}}>
            <img src={logo} alt="Application Logo" style={{width: '100%', borderRadius: '8px'}} />
          </Box>
          <Box sx={{flex: 1}}>
            <Typography variant="h5">{window.siteConfiguration.application.name}</Typography>
            <Typography variant="subtitle2" color="grey.500">Share this app</Typography>
          </Box>
          <Box><IconButton onClick={props.onClose}><Close /></IconButton></Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Stack direction="row" mt={2} mb={3} spacing={3} pl={1} pr={1}>
          <ShareButton name="X" image={xSocial} onClick={shareX} />
          <ShareButton name="Facebook" image={facebookSocial} onClick={shareFacebook} />
          <ShareButton name="WhatsApp" image={whatsappSocial} onClick={shareWhatsApp} />
          <ShareButton name="Email" image={<Email sx={{fontSize: 30}} />} onClick={shareEmail} />
        </Stack>
        <TextField InputProps={{
          endAdornment: <Button onClick={() => navigator.clipboard.writeText(window.location.href)} endIcon={<ContentCopy />}>Copy</Button>
        }} fullWidth disabled value={window.location.href} />
      </DialogContent>
    </Dialog>
  );
}

function Header() {
  const greaterThan600 = useMediaQuery('(min-width:600px)');
  const greaterThan840 = useMediaQuery('(min-width:840px)');
  const greaterThan1280 = useMediaQuery('(min-width:1280px)');

  const [isShareDialogOpen, toggleShareDialog] = useState(false);

  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        url: window.location.href,
        text: `Check out "${window.siteConfiguration.application.name}"`,
      });
    } else {
      toggleShareDialog(true);
    }
  }

  const formatNumber = (n : number) => {
    var formatted = n.toString();

    if (n >= 1000) {
      formatted = Math.round(n / 100) / 10 + 'K';
    } else if (n >= 1000000) {
      formatted = Math.round(n / 100000) / 10 + 'M';
    }

    return formatted;
  }

  const formatSize = (size : number) => {
    var formatted = size + ' B';

    if (size > 1024 * 1024) {
      size /= 1024 * 1024;                    // Converting Bytes to Megabytes
      size = Math.round(size * 10) / 10;      // Rounding to the first decimal
      formatted = size + ' MB';               // Adding an MB postfix
    } else if (size > 1024) {
      size /= 1024;                           // Converting Bytes to Kilobytes
      size = Math.round(size * 10) / 10;      // Rounding to the first decimal
      formatted = size + ' KB';               // Adding an MB postfix
    } else {
      size = Math.round(size * 10) / 10;      // Rounding to the first decimal
      formatted = size + ' B';                // Adding an MB postfix
    }

    return formatted;
  }

  return (
    <Box sx={{
      display: greaterThan840 ? 'flex' : 'block',
      justifyContent: 'space-between',
    }}>
      <Box>
        <Box sx={{display: 'flex', gap: 4}}>
          {!greaterThan840 && <Box sx={{width: '75px', height: '75px', mt: 1, borderRadius: '18px', boxShadow: 10}}>
            <img src={logo} alt="Application Logo" style={{width: '100%', borderRadius: '18px'}} />
          </Box>}
          <Box sx={{flex: 1}}>
            <Typography variant={greaterThan1280 ? "h2" : "h4"} fontWeight="bold" mb={2}>{window.siteConfiguration.application.name}</Typography>
            <Link href={window.siteConfiguration.developer.website} underline="none" fontWeight="bold">{window.siteConfiguration.developer.name}</Link>
          </Box>
        </Box>
        <Stack 
          direction="row" mt={3} 
          divider={
            <Divider 
              sx={{height: '25px', marginTop: 'auto !important', marginBottom: 'auto !important'}} 
              orientation="vertical" 
              variant="middle" 
              flexItem 
            />
          } 
          spacing={3}
        >
          <InfoItem name="Downloads" value={formatNumber(window.siteConfiguration.application.downloads)} />
          <InfoItem name="Version" value={window.siteConfiguration.application.versionName} />
          <InfoItem name="Download Size" value={formatSize(window.siteConfiguration.application.size)} />
        </Stack>
        <Box sx={{display: greaterThan600 ? 'flex' : 'block', mt: 3, gap: 2}}>
          <a href="/download">
            <Button variant="contained" sx={{width: greaterThan600 ? '200px' : '100%'}}>Download</Button>
          </a>
          <Stack direction="row" spacing={2} mt={greaterThan600 ? 0 : 2}>
            {greaterThan1280 || !greaterThan600
              ? (<>
                  <Button onClick={handleShareClick} startIcon={<Share />} fullWidth={!greaterThan600}>Share</Button>
                </>)
              : (<>
                  <IconButton onClick={handleShareClick} color="primary"><Share /></IconButton>
                </>)
            }
          </Stack>
        </Box>
      </Box>
      {greaterThan840 && <Box sx={{width: '230px', position: 'relative'}}>
        <img src={logo} alt="Application Logo" style={{
          width: '85%',
          position: 'absolute',
          top: '40px',
          left: 0,
          right: 0,
          margin: 'auto',
          filter: 'blur(10px)',
          opacity: '0.7',
          borderRadius: '40px'
        }} />
        <img src={logo} alt="Application Logo" style={{width: '100%', position: 'absolute', borderRadius: '40px'}} />
      </Box>}
      <ShareDialog isOpened={isShareDialogOpen} onClose={() => toggleShareDialog(false)} />
    </Box>
  );
}

export default Header;
