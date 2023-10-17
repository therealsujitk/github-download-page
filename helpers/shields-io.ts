import got from 'got';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 21600, checkperiod: 3600 });

interface Badge {
  key: string,
  value: string,
  color: string,
  style: string,
};

async function createBadge(badge: Badge) {
  const url = new URL(`http://img.shields.io/badge/${badge.key}-${badge.value}-${badge.color}?style=${badge.style}`);
  
  if (cache.has(url.toString())) {
    return cache.get(url.toString());
  }

  const response = (await got(url)).body;
  cache.set(url.toString(), response);
  return response;
}

function createReleaseBadge(release: string) {
  const badge: Badge = {
    key: 'release',
    value: release,
    color: 'blue',
    style: 'flat',
  }

  return createBadge(badge);
}``

function createDownloadsBadge(downloads: number) {
  const badge: Badge = {
    key: 'downloads',
    value: '0',
    color: 'green',
    style: 'flat',
  }

  if (downloads == 0 || downloads == undefined) {
    badge.color = 'red';
  } else if (downloads >= 1000) {
    badge.color = 'brightgreen';
    badge.value = Math.round(downloads / 100) / 10 + 'K';
  } else if (downloads >= 1000000) {
    badge.color = 'brightgreen';
    badge.value = Math.round(downloads / 100000) / 10 + 'M';
  }

  return createBadge(badge);
}

export default {
  createBadge,
  createDownloadsBadge,
  createReleaseBadge,
};
