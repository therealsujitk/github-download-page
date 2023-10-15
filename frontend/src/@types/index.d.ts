export {};

declare global {
  interface Window {
    siteConfiguration: {
      application: {
        name: string,
        versionName: string|null,
        downloads: number,
        size: number,
        description: string,
        website: string|null,
        github: string|null,
        bugs: string|null,
        info: {
          minimumRequirement: string|null,
          releasedOn: string,
          updatedOn: string,
        },
      }
      developer: {
        name: string,
        logo: string|null,
        website: string,
      }
      site: {
        primaryColor: string,
        links: {
          name: string,
          href: string,
        }[],
      },
      [prop: string]: any,
    };
  }
}
