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
const cache = new node_cache_1.default({ stdTTL: 21600, checkperiod: 3600 });
;
function createBadge(badge) {
    return __awaiter(this, void 0, void 0, function* () {
        badge.value = badge.value.replace(/-/g, '--');
        const url = new URL(`http://img.shields.io/badge/${badge.key}-${badge.value}-${badge.color}?style=${badge.style}`);
        if (cache.has(url.toString())) {
            return cache.get(url.toString());
        }
        const response = (yield (0, got_1.default)(url)).body;
        cache.set(url.toString(), response);
        return response;
    });
}
function createReleaseBadge(release) {
    const badge = {
        key: 'release',
        value: release,
        color: 'blue',
        style: 'flat',
    };
    return createBadge(badge);
}
``;
function createDownloadsBadge(downloads) {
    const badge = {
        key: 'downloads',
        value: '0',
        color: 'green',
        style: 'flat',
    };
    if (downloads == 0 || downloads == undefined) {
        badge.color = 'red';
    }
    else if (downloads >= 1000) {
        badge.color = 'brightgreen';
        badge.value = Math.round(downloads / 100) / 10 + 'K';
    }
    else if (downloads >= 1000000) {
        badge.color = 'brightgreen';
        badge.value = Math.round(downloads / 100000) / 10 + 'M';
    }
    return createBadge(badge);
}
exports.default = {
    createBadge,
    createDownloadsBadge,
    createReleaseBadge,
};
