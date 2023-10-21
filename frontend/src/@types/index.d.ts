import { SiteConfiguration } from "../../../index.d";

export interface ExtendedSiteConfiguration extends SiteConfiguration {
  application: SiteConfiguration['application'] & {
    downloads?: number,
    size?: number,
    info: {
      minimumRequirement?: string|null,
      releasedOnString: string,
      updatedOnString?: string,
    },
  },
  site: SiteConfiguration['site'] & {
    statusCode: number,
    basePath: string,
  },
  privacyPolicy?: string | {
    lastUpdated: Date,
    lastUpdatedString: string,
    body: {
      heading: string,
      content: string[],
    }[],
  },
}

declare global {
  interface Window {
    siteConfiguration: ExtendedSiteConfiguration,
  }
}
