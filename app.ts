import express from 'express';
import fs from 'fs';
import path from 'path';
import SheildsIO from './helpers/shields-io';
import GitHub from './helpers/github';
import Config from './config.json';
import { format } from 'date-fns';

const app = express();

app.use(express.static(path.join(__dirname, '/frontend/build'), { index: false }));
app.get('/', async (_, res) => {
  try {
    res.status(200).send(await loadIndex(200, '/'));
  } catch (error) {
    res.status(500).send(await loadIndex(500));
  }
});

app.get('/privacy-policy', async (_, res) => {
  try {
    res.status(200).send(await loadIndex(200, '/privacy-policy'));
  } catch (error) {
    res.status(500).send(await loadIndex(500));
  }
});

app.get('/download', async (_, res) => {
  try {
    if (Config.application.downloadLink === null) {
      const release = await getRelease();
      res.redirect(release['assets'][0]['browser_download_url']);
    } else {
      res.redirect(Config.application.downloadLink);
    }
  } catch (error) {
    res.status(500).send(await loadIndex(500));
  }
});

app.get('/about.json', async (_, res) => {
  try {
    const tagName = await getTagName();
    const release = await getRelease();
    
    const about = {
      downloads: await GitHub.getDownloadCount(),
      updatedOn: release['published_at'],
      releaseNotes: release['body'],
      versionName: tagName,
      versionCode: Config.application.versionCode,
    };

    res.status(200).json(about);
  } catch (error) {
    res.status(500).send(await loadIndex(500));
  }
});

app.get('/release.svg', async (_, res) => {
  try {
    res.setHeader('Content-type', 'image/svg+xml');
    res.status(200).send(await SheildsIO.createReleaseBadge(await getTagName()));
  } catch (error) {
    res.status(500).send(await loadIndex(500));
  }
});

app.get('/downloads.svg', async (_, res) => {

  try {
    const downloadCount = await GitHub.getDownloadCount();
    res.setHeader('Content-type', 'image/svg+xml');
    res.status(200).send(await SheildsIO.createDownloadsBadge(downloadCount));
  } catch (error) {
    res.status(500).send(await loadIndex(500));
  }
});

app.get('/*', async (_, res) => {
  try {
    res.status(404).send(await loadIndex(404));
  } catch (error) {
    res.status(500).send(await loadIndex(500));
  }
});

async function loadIndex(statusCode: number, route: string|undefined = undefined) {
  let index = fs.readFileSync(__dirname + '/frontend/build/index.html').toString();
  const siteConfiguration: {[x: string]: any} = Config;
  siteConfiguration.site.statusCode = statusCode;

  if (statusCode === 200) {
    switch (route) {
      case '/privacy-policy':
        index = index.replace(/__SITE_TITLE__/g, 'Privacy Policy');
        index = index.replace(/__SITE_DESCRIPTION__/g, '');
      default:
        const release = await getRelease();

        siteConfiguration.application.downloads = await GitHub.getDownloadCount();
        siteConfiguration.application.size = release['assets'][0]?.['size'] ?? NaN;
        siteConfiguration.application.versionName = siteConfiguration.application.versionName ?? await getTagName();
        siteConfiguration.application.info.updatedOn = format(new Date(release['published_at']), 'MMM d, yyyy');

        index = index.replace(/__SITE_TITLE__/g, `${Config.application.name} - ${Config.developer.name}`);
        index = index.replace(/__SITE_DESCRIPTION__/g, Config.application.description);
    }

  } else if (statusCode === 404) {
    index = index.replace(/__SITE_TITLE__/g, '404 - Page Not Found');
    index = index.replace(/__SITE_DESCRIPTION__/g, '');
  } else if (statusCode === 500) {
    index = index.replace(/__SITE_TITLE__/g, '500 - Internal Server Error');
    index = index.replace(/__SITE_DESCRIPTION__/g, '');
  } else {
    index = index.replace(/__SITE_TITLE__/g, `${statusCode} - An Error Occurred`);
    index = index.replace(/__SITE_DESCRIPTION__/g, '');
  }

  index = index.replace(/__SITE_THEME_COLOR__/g, Config.site.primaryColor);
  index = index.replace(/__SITE_CONFIGURATION__/, encodeURIComponent(JSON.stringify(siteConfiguration)));

  return index;
}

async function getTagName() {
  var tagName: string|null = Config.application.tagName;

  if (tagName === null) {
    const release = await GitHub.getLatestRelease();
    tagName = release['tag_name'] as string;
  }

  return tagName;
}

async function getRelease() {
  const tagName = await getTagName();
  return await GitHub.getReleaseByTag(tagName);
}

export default app;
