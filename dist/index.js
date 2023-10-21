"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadPageRouter = void 0;
const express_1 = __importStar(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shields_io_1 = __importDefault(require("./helpers/shields-io"));
const github_1 = __importDefault(require("./helpers/github"));
const date_fns_1 = require("date-fns");
const downloadPageRouter = (options) => {
    var _a;
    const router = (0, express_1.Router)();
    const siteConfiguration = options !== null && options !== void 0 ? options : {
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
    var basePath = (_a = siteConfiguration.site.basePath) !== null && _a !== void 0 ? _a : '';
    if (!siteConfiguration.site.basePath) {
        siteConfiguration.site.basePath = '/';
    }
    else if (siteConfiguration.site.basePath.endsWith('/')) {
        basePath = basePath.slice(0, -1);
    }
    const getTagName = () => __awaiter(void 0, void 0, void 0, function* () {
        if (siteConfiguration.application.tagName) {
            return siteConfiguration.application.tagName;
        }
        const release = yield github_1.default.getLatestRelease(siteConfiguration.application.github);
        return release['tag_name'];
    });
    const getRelease = () => __awaiter(void 0, void 0, void 0, function* () {
        if (!siteConfiguration.application.tagName) {
            return yield github_1.default.getLatestRelease(siteConfiguration.application.github);
        }
        const tagName = yield getTagName();
        return yield github_1.default.getReleaseByTag(siteConfiguration.application.github, tagName);
    });
    const loadIndex = (statusCode, route = undefined) => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c, _d;
        let index = fs_1.default.readFileSync(__dirname + '/frontend/build/index.html').toString();
        const extendedSiteConfiguration = Object.assign(Object.assign({}, siteConfiguration), { application: Object.assign(Object.assign({}, siteConfiguration.application), { info: Object.assign(Object.assign({}, siteConfiguration.application.info), { releasedOnString: (0, date_fns_1.format)(siteConfiguration.application.info.releasedOn, 'MMM d, yyyy') }) }), site: Object.assign(Object.assign({}, siteConfiguration.site), { statusCode: statusCode }), privacyPolicy: !siteConfiguration.privacyPolicy
                ? undefined
                : typeof siteConfiguration.privacyPolicy === 'string'
                    ? siteConfiguration.privacyPolicy
                    : Object.assign(Object.assign({}, siteConfiguration.privacyPolicy), { lastUpdatedString: (0, date_fns_1.format)(siteConfiguration.privacyPolicy.lastUpdated, 'MMMM d, yyyy') }) });
        if (statusCode === 200) {
            switch (route) {
                case '/privacy-policy':
                    index = index.replace(/__SITE_TITLE__/g, 'Privacy Policy');
                    index = index.replace(/__SITE_DESCRIPTION__/g, '');
                default:
                    const release = yield getRelease();
                    if ((_b = release['assets'][0]) === null || _b === void 0 ? void 0 : _b['size']) {
                        extendedSiteConfiguration.application.size = (_c = release['assets'][0]) === null || _c === void 0 ? void 0 : _c['size'];
                    }
                    extendedSiteConfiguration.application.downloads = yield github_1.default.getDownloadCount(siteConfiguration.application.github);
                    extendedSiteConfiguration.application.tagName = (_d = siteConfiguration.application.tagName) !== null && _d !== void 0 ? _d : yield getTagName();
                    extendedSiteConfiguration.application.info.releasedOnString = (0, date_fns_1.format)(siteConfiguration.application.info.releasedOn, 'MMM d, yyyy'),
                        extendedSiteConfiguration.application.info.updatedOnString = (0, date_fns_1.format)(new Date(release['published_at']), 'MMM d, yyyy');
                    index = index.replace(/__SITE_TITLE__/g, `${siteConfiguration.application.name} - ${siteConfiguration.developer.name}`);
                    index = index.replace(/__SITE_DESCRIPTION__/g, siteConfiguration.application.description);
            }
        }
        else if (statusCode === 404) {
            index = index.replace(/__SITE_TITLE__/g, '404 - Page Not Found');
            index = index.replace(/__SITE_DESCRIPTION__/g, '');
        }
        else if (statusCode === 500) {
            index = index.replace(/__SITE_TITLE__/g, '500 - Internal Server Error');
            index = index.replace(/__SITE_DESCRIPTION__/g, '');
        }
        else {
            index = index.replace(/__SITE_TITLE__/g, `${statusCode} - An Error Occurred`);
            index = index.replace(/__SITE_DESCRIPTION__/g, '');
        }
        index = index.replace(/__SITE_THEME_COLOR__/g, siteConfiguration.site.primaryColor);
        index = index.replace(/__SITE_CONFIGURATION__/, encodeURIComponent(JSON.stringify(extendedSiteConfiguration)));
        return index;
    });
    router.use(express_1.default.static(path_1.default.join(__dirname, '/frontend/build'), { index: false }));
    router.get(`${basePath}/`, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.status(200).send(yield loadIndex(200, '/'));
        }
        catch (error) {
            res.status(500).send(yield loadIndex(500));
        }
    }));
    router.get(`${basePath}/privacy-policy`, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!siteConfiguration.privacyPolicy) {
                res.status(404).send(yield loadIndex(404));
            }
            else if (typeof siteConfiguration.privacyPolicy === 'string') {
                res.status(200).redirect(siteConfiguration.privacyPolicy);
            }
            else {
                res.status(200).send(yield loadIndex(200, '/privacy-policy'));
            }
        }
        catch (error) {
            res.status(500).send(yield loadIndex(500));
        }
    }));
    router.get(`${basePath}/download`, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!siteConfiguration.application.downloadLink) {
                const release = yield getRelease();
                res.redirect(release['assets'][0]['browser_download_url']);
            }
            else {
                res.redirect(siteConfiguration.application.downloadLink);
            }
        }
        catch (error) {
            res.status(500).send(yield loadIndex(500));
        }
    }));
    router.get(`${basePath}/about.json`, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tagName = yield getTagName();
            const release = yield getRelease();
            const about = Object.assign({ downloads: yield github_1.default.getDownloadCount(siteConfiguration.application.github), updatedOn: release['published_at'], releaseNotes: release['body'], tagName: tagName }, siteConfiguration.application.aboutJson);
            res.status(200).json(about);
        }
        catch (error) {
            res.status(500).send(yield loadIndex(500));
        }
    }));
    router.get(`${basePath}/release.svg`, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.setHeader('Content-type', 'image/svg+xml');
            res.status(200).send(yield shields_io_1.default.createReleaseBadge(yield getTagName()));
        }
        catch (error) {
            res.status(500).send(yield loadIndex(500));
        }
    }));
    router.get(`${basePath}/downloads.svg`, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const downloadCount = yield github_1.default.getDownloadCount(siteConfiguration.application.github);
            res.setHeader('Content-type', 'image/svg+xml');
            res.status(200).send(yield shields_io_1.default.createDownloadsBadge(downloadCount));
        }
        catch (error) {
            res.status(500).send(yield loadIndex(500));
        }
    }));
    router.get(`${basePath}/*`, (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            res.status(404).send(yield loadIndex(404));
        }
        catch (error) {
            res.status(500).send(yield loadIndex(500));
        }
    }));
    return router;
};
exports.downloadPageRouter = downloadPageRouter;
