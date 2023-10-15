const express = require('express');
const fs = require('fs');
const path = require('path');
const { fileURLToPath } = require('url');
const SheildsIO = require('./helpers/shields-io.js');
const GitHub = require('./helpers/github.js');
const Config = require('./config.json');
const { format } = require('date-fns');

const app = express();

app.get('/download', async (_, res) => {
  try {
    if (Config.application.downloadLink === null) {
      const release = await getRelease();
      res.redirect(release['assets'][0]['browser_download_url']);
    } else {
      res.redirect(Config.application.downloadLink);
    }
  } catch (error) {
    res.status(500).send('500 Internal Server Error');
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
    res.status(500).send('500 Internal Server Error');
  }
});

app.get('/release.svg', async (_, res) => {
  try {
    res.setHeader('Content-type', 'image/svg+xml');
    res.status(200).send(await SheildsIO.createReleaseBadge(await getTagName()));
  } catch (error) {
    res.status(500).send('500 Internal Server Error');
  }
});

app.get('/downloads.svg', async (_, res) => {

  try {
    const downloadCount = await GitHub.getDownloadCount();
    res.setHeader('Content-type', 'image/svg+xml');
    res.status(200).send(await SheildsIO.createDownloadsBadge(downloadCount));
  } catch (error) {
    res.status(500).send('500 Internal Server Error');
  }
});

app.use(express.static(path.join(__dirname, '/frontend/build'), { index: false }));
app.get('/*', async (_, res) => {
  try {
    const siteConfiguration: any = Config;
    const release = await getRelease();
    let index = fs.readFileSync(__dirname + '/frontend/build/index.html').toString();

    siteConfiguration.application.downloads = await GitHub.getDownloadCount();
    siteConfiguration.application.size = release['assets'][0]?.['size'] ?? NaN;
    siteConfiguration.application.versionName = siteConfiguration.application.versionName ?? await getTagName();
    siteConfiguration.application.info.updatedOn = format(new Date(release['published_at']), 'MMM d, yyyy');
    
    index = index.replace(/__SITE_TITLE__/g, `${Config.application.name} - ${Config.developer.name}`);
    index = index.replace(/__SITE_DESCRIPTION__/g, Config.application.description);
    index = index.replace(/__SITE_THEME_COLOR__/g, Config.site.primaryColor);
    index = index.replace(/__SITE_CONFIGURATION__/, encodeURIComponent(JSON.stringify(siteConfiguration)));

    res.status(200).send(index);
  } catch (error) {
    res.status(500).send('500 Internal Server Error');
  }
});

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

module.exports = app;
