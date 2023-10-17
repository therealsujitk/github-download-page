import express, { Router } from 'express';
import fs from 'fs';
import path from 'path';
import SheildsIO from './helpers/shields-io';
import GitHub from './helpers/github';
import { format } from 'date-fns';
import { SiteConfiguration } from './index.d';
import { ExtendedSiteConfiguration } from './frontend/src/@types';

const downloadPageRouter = (options?: SiteConfiguration) => {
  const router = Router();
  const siteConfiguration: SiteConfiguration = options ?? {
    application: {
      name: "Material Components Catalog",
      description: "This is a download page for your GitHub project inspired by Google Play Store. As an example I have used the material components for android catalog app to showcase this site. Click the GitHub link in the navigation bar to get your own copy.",
      github: "material-components/material-components-android",
      info: {
        minimumRequirement: 'Android 6.0+',
        releasedOn: new Date(2018, 10, 15),
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
    },
    privacyPolicy: {
      lastUpdated: new Date(2023, 9, 16),
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

  const getTagName = async () => {
    if (siteConfiguration.application.tagName) {
      return siteConfiguration.application.tagName;
    }

    const release = await GitHub.getLatestRelease(siteConfiguration.application.github);
    return release['tag_name'] as string;
  }
  
  const getRelease = async () => {
    if (!siteConfiguration.application.tagName) {
      return await GitHub.getLatestRelease(siteConfiguration.application.github);
    }

    const tagName = await getTagName();
    return await GitHub.getReleaseByTag(siteConfiguration.application.github, tagName);
  }

  const loadIndex = async (statusCode: number, route: string|undefined = undefined) => {
    let index = fs.readFileSync(__dirname + '/frontend/build/index.html').toString();
    const extendedSiteConfiguration: ExtendedSiteConfiguration = {
      ...siteConfiguration,
      application: {
        ...siteConfiguration.application,
        info: {
          ...siteConfiguration.application.info,
          releasedOnString: format(siteConfiguration.application.info.releasedOn, 'MMM d, yyyy'),
        }
      },
      site: {
        ...siteConfiguration.site,
        statusCode: statusCode,
      },
      privacyPolicy: !siteConfiguration.privacyPolicy 
        ? undefined 
        : typeof siteConfiguration.privacyPolicy === 'string' 
          ? siteConfiguration.privacyPolicy 
          : {
            ...siteConfiguration.privacyPolicy,
            lastUpdatedString: format(siteConfiguration.privacyPolicy.lastUpdated, 'MMMM d, yyyy'),
          },
    }
  
    if (statusCode === 200) {
      switch (route) {
        case '/privacy-policy':
          index = index.replace(/__SITE_TITLE__/g, 'Privacy Policy');
          index = index.replace(/__SITE_DESCRIPTION__/g, '');
        default:
          const release = await getRelease();

          if (release['assets'][0]?.['size']) {
            extendedSiteConfiguration.application.size = release['assets'][0]?.['size'];
          }
  
          extendedSiteConfiguration.application.downloads = await GitHub.getDownloadCount(siteConfiguration.application.github);
          extendedSiteConfiguration.application.tagName = siteConfiguration.application.tagName ?? await getTagName();
          extendedSiteConfiguration.application.info.releasedOnString = format(siteConfiguration.application.info.releasedOn, 'MMM d, yyyy'),
          extendedSiteConfiguration.application.info.updatedOnString = format(new Date(release['published_at']), 'MMM d, yyyy');
  
          index = index.replace(/__SITE_TITLE__/g, `${siteConfiguration.application.name} - ${siteConfiguration.developer.name}`);
          index = index.replace(/__SITE_DESCRIPTION__/g, siteConfiguration.application.description);
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
  
    index = index.replace(/__SITE_THEME_COLOR__/g, siteConfiguration.site.primaryColor);
    index = index.replace(/__SITE_CONFIGURATION__/, encodeURIComponent(JSON.stringify(extendedSiteConfiguration)));
  
    return index;
  }

  router.use(express.static(path.join(__dirname, '/frontend/build'), { index: false }));
  router.get('/', async (_, res) => {
    try {
      res.status(200).send(await loadIndex(200, '/'));
    } catch (error) {
      res.status(500).send(await loadIndex(500));
    }
  });
  
  router.get('/privacy-policy', async (_, res) => {
    try {
      if (!siteConfiguration.privacyPolicy) {
        res.status(404).send(await loadIndex(404));
      } else if (typeof siteConfiguration.privacyPolicy === 'string') {
        res.status(200).redirect(siteConfiguration.privacyPolicy);
      } else {
        res.status(200).send(await loadIndex(200, '/privacy-policy'));
      }
    } catch (error) {
      res.status(500).send(await loadIndex(500));
    }
  });
  
  router.get('/download', async (_, res) => {
    try {
      if (!siteConfiguration.application.downloadLink) {
        const release = await getRelease();
        res.redirect(release['assets'][0]['browser_download_url']);
      } else {
        res.redirect(siteConfiguration.application.downloadLink);
      }
    } catch (error) {
      res.status(500).send(await loadIndex(500));
    }
  });
  
  router.get('/about.json', async (_, res) => {
    try {
      const tagName = await getTagName();
      const release = await getRelease();
      
      const about = {
        downloads: await GitHub.getDownloadCount(siteConfiguration.application.github),
        updatedOn: release['published_at'],
        releaseNotes: release['body'],
        tagName: tagName,
        ...siteConfiguration.application.aboutJson,
      };
  
      res.status(200).json(about);
    } catch (error) {
      res.status(500).send(await loadIndex(500));
    }
  });
  
  router.get('/release.svg', async (_, res) => {
    try {
      res.setHeader('Content-type', 'image/svg+xml');
      res.status(200).send(await SheildsIO.createReleaseBadge(await getTagName()));
    } catch (error) {
      res.status(500).send(await loadIndex(500));
    }
  });
  
  router.get('/downloads.svg', async (_, res) => {
    try {
      const downloadCount = await GitHub.getDownloadCount(siteConfiguration.application.github);
      res.setHeader('Content-type', 'image/svg+xml');
      res.status(200).send(await SheildsIO.createDownloadsBadge(downloadCount));
    } catch (error) {
      res.status(500).send(await loadIndex(500));
    }
  });
  
  router.get('/*', async (_, res) => {
    try {
      res.status(404).send(await loadIndex(404));
    } catch (error) {
      res.status(500).send(await loadIndex(500));
    }
  });

  return router;
}

export { downloadPageRouter };
