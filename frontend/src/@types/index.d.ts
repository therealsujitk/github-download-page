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
  },
}

declare global {
  interface Window {
    siteConfiguration: ExtendedSiteConfiguration,
  }
}
