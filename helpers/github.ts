import got from 'got';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 21600, checkperiod: 3600 });

async function getReleases(repository: string) {
  const url = new URL(`https://api.github.com/repos/${repository}/releases`);

  if (cache.has(url.toString())) {
    return cache.get(url.toString());
  }

  const response = JSON.parse((await got(url)).body);
  cache.set(url.toString(), response);
  return response;
}

async function getLatestRelease(repository: string) {
  const url = new URL(`https://api.github.com/repos/${repository}/releases/latest`);
  
  if (cache.has(url.toString())) {
    return cache.get(url.toString());
  }

  const response = JSON.parse((await got(url)).body);
  cache.set(url.toString(), response);
  return response;
}

async function getReleaseByTag(repository: string, tag: string) {
  const url = new URL(`https://api.github.com/repos/${repository}/releases/tags/${tag}`);
  
  if (cache.has(url.toString())) {
    return cache.get(url.toString());
  }

  const response = JSON.parse((await got(url)).body);
  cache.set(url.toString(), response);
  return response;
}

async function getDownloadCount(repository: string) {
  const releases: any[] = await getReleases(repository);
  let downloadCount = 0;

  for (let i = 0; i < releases.length; ++i) {
    for (let j = 0; j < releases[i]['assets'].length; ++j) {
      downloadCount += releases[i]['assets'][j]['download_count'];
    }
  }

  return downloadCount;
}

export default {
  getReleases,
  getLatestRelease,
  getReleaseByTag,
  getDownloadCount,
};
