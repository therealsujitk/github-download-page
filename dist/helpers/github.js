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
const got_1 = __importDefault(require("got"));
const node_cache_1 = __importDefault(require("node-cache"));
const config_json_1 = __importDefault(require("../config.json"));
const repository = config_json_1.default.application.github;
const cache = new node_cache_1.default({ stdTTL: 21600, checkperiod: 3600 });
function getReleases() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(`https://api.github.com/repos/${repository}/releases`);
        if (cache.has(url.toString())) {
            return cache.get(url.toString());
        }
        const response = JSON.parse((yield (0, got_1.default)(url)).body);
        cache.set(url.toString(), response);
        return response;
    });
}
function getLatestRelease() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(`https://api.github.com/repos/${repository}/releases/latest`);
        if (cache.has(url.toString())) {
            return cache.get(url.toString());
        }
        const response = JSON.parse((yield (0, got_1.default)(url)).body);
        cache.set(url.toString(), response);
        return response;
    });
}
function getReleaseByTag(tag) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(`https://api.github.com/repos/${repository}/releases/tags/${tag}`);
        if (cache.has(url.toString())) {
            return cache.get(url.toString());
        }
        const response = JSON.parse((yield (0, got_1.default)(url)).body);
        cache.set(url.toString(), response);
        return response;
    });
}
function getDownloadCount() {
    return __awaiter(this, void 0, void 0, function* () {
        const releases = yield getReleases();
        let downloadCount = 0;
        for (let i = 0; i < releases.length; ++i) {
            for (let j = 0; j < releases[i]['assets'].length; ++j) {
                downloadCount += releases[i]['assets'][j]['download_count'];
            }
        }
        return downloadCount;
    });
}
exports.default = {
    getReleases,
    getLatestRelease,
    getReleaseByTag,
    getDownloadCount,
};
