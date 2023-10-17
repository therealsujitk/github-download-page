import { Router } from "express";

declare interface SiteConfiguration {
  application: {
    name: string,
    tagName?: string,
    description: string,
    downloadLink?: string,
    website?: string,
    github: `${string}/${string}`,
    bugs?: string,
    privacyPolicy?: string,
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
    links: {
      name: string,
      href: string,
    }[],
  },
}

declare module 'github-download-page' {
  function downloadPageRouter(options?: SiteConfiguration): Router;
}
