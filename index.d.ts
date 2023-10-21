import { Router } from "express";

declare interface SiteConfiguration {
  application: {
    name: string,
    tagName?: string,
    description: string,
    logo?: string,
    screenshots?: string[],
    downloadLink?: string,
    website?: string,
    github: `${string}/${string}`,
    bugs?: string,
    info: {
      minimumRequirement?: string,
      releasedOn: Date,
    },
    aboutJson?: {[x:string]: string|number},
  }
  developer: {
    name: string,
    logo?: string,
    website?: string,
  }
  site: {
    primaryColor: `#${string}`,
    links?: {
      name: string,
      href: string,
    }[],
    basePath?: `/${string}`,
  },
  privacyPolicy?: string | {
    lastUpdated: Date,
    body: {
      heading: string,
      content: string[],
    }[],
  },
}

declare module 'github-download-page' {
  function downloadPageRouter(options?: SiteConfiguration): Router;
}
