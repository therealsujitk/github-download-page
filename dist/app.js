"use strict";
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
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const shields_io_1 = __importDefault(require("./helpers/shields-io"));
const github_1 = __importDefault(require("./helpers/github"));
const config_json_1 = __importDefault(require("./config.json"));
const date_fns_1 = require("date-fns");
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '/frontend/build'), { index: false }));
app.get('/', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send(yield loadIndex(200, '/'));
    }
    catch (error) {
        res.status(500).send(yield loadIndex(500));
    }
}));
app.get('/privacy-policy', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).send(yield loadIndex(200, '/privacy-policy'));
    }
    catch (error) {
        res.status(500).send(yield loadIndex(500));
    }
}));
app.get('/download', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (config_json_1.default.application.downloadLink === null) {
            const release = yield getRelease();
            res.redirect(release['assets'][0]['browser_download_url']);
        }
        else {
            res.redirect(config_json_1.default.application.downloadLink);
        }
    }
    catch (error) {
        res.status(500).send(yield loadIndex(500));
    }
}));
app.get('/about.json', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tagName = yield getTagName();
        const release = yield getRelease();
        const about = {
            downloads: yield github_1.default.getDownloadCount(),
            updatedOn: release['published_at'],
            releaseNotes: release['body'],
            versionName: tagName,
            versionCode: config_json_1.default.application.versionCode,
        };
        res.status(200).json(about);
    }
    catch (error) {
        res.status(500).send(yield loadIndex(500));
    }
}));
app.get('/release.svg', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.setHeader('Content-type', 'image/svg+xml');
        res.status(200).send(yield shields_io_1.default.createReleaseBadge(yield getTagName()));
    }
    catch (error) {
        res.status(500).send(yield loadIndex(500));
    }
}));
app.get('/downloads.svg', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const downloadCount = yield github_1.default.getDownloadCount();
        res.setHeader('Content-type', 'image/svg+xml');
        res.status(200).send(yield shields_io_1.default.createDownloadsBadge(downloadCount));
    }
    catch (error) {
        res.status(500).send(yield loadIndex(500));
    }
}));
app.get('/*', (_, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(404).send(yield loadIndex(404));
    }
    catch (error) {
        res.status(500).send(yield loadIndex(500));
    }
}));
function loadIndex(statusCode, route = undefined) {
    var _a, _b, _c;
    return __awaiter(this, void 0, void 0, function* () {
        let index = fs_1.default.readFileSync(__dirname + '/frontend/build/index.html').toString();
        const siteConfiguration = config_json_1.default;
        siteConfiguration.site.statusCode = statusCode;
        if (statusCode === 200) {
            switch (route) {
                case '/privacy-policy':
                    index = index.replace(/__SITE_TITLE__/g, 'Privacy Policy');
                    index = index.replace(/__SITE_DESCRIPTION__/g, '');
                default:
                    const release = yield getRelease();
                    siteConfiguration.application.downloads = yield github_1.default.getDownloadCount();
                    siteConfiguration.application.size = (_b = (_a = release['assets'][0]) === null || _a === void 0 ? void 0 : _a['size']) !== null && _b !== void 0 ? _b : NaN;
                    siteConfiguration.application.versionName = (_c = siteConfiguration.application.versionName) !== null && _c !== void 0 ? _c : yield getTagName();
                    siteConfiguration.application.info.updatedOn = (0, date_fns_1.format)(new Date(release['published_at']), 'MMM d, yyyy');
                    index = index.replace(/__SITE_TITLE__/g, `${config_json_1.default.application.name} - ${config_json_1.default.developer.name}`);
                    index = index.replace(/__SITE_DESCRIPTION__/g, config_json_1.default.application.description);
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
        index = index.replace(/__SITE_THEME_COLOR__/g, config_json_1.default.site.primaryColor);
        index = index.replace(/__SITE_CONFIGURATION__/, encodeURIComponent(JSON.stringify(siteConfiguration)));
        return index;
    });
}
function getTagName() {
    return __awaiter(this, void 0, void 0, function* () {
        var tagName = config_json_1.default.application.tagName;
        if (tagName === null) {
            const release = yield github_1.default.getLatestRelease();
            tagName = release['tag_name'];
        }
        return tagName;
    });
}
function getRelease() {
    return __awaiter(this, void 0, void 0, function* () {
        const tagName = yield getTagName();
        return yield github_1.default.getReleaseByTag(tagName);
    });
}
exports.default = app;
