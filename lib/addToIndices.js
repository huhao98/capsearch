"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
var srt = __importStar(require("./srt"));
var iconv_lite_1 = require("iconv-lite");
var crypto_1 = require("crypto");
var algoliasearch_1 = __importDefault(require("algoliasearch"));
function addToIndices(options) {
    return __awaiter(this, void 0, void 0, function () {
        var uri, captionFile, outputFile, _a, group, _b, overlap, _c, enc, captions, records;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    uri = options.uri, captionFile = options.captionFile, outputFile = options.outputFile, _a = options.group, group = _a === void 0 ? 3 : _a, _b = options.overlap, overlap = _b === void 0 ? 0 : _b, _c = options.enc, enc = _c === void 0 ? "UTF-8" : _c;
                    captions = parseSRT(captionFile, enc);
                    records = getRecords(captions, uri, group, overlap);
                    if (!outputFile) return [3 /*break*/, 1];
                    console.log("Write index to json " + outputFile);
                    writeRecords(outputFile, records);
                    return [3 /*break*/, 3];
                case 1:
                    console.log("Start indexing " + records.length + " records");
                    return [4 /*yield*/, indexRecords(records)];
                case 2:
                    _d.sent();
                    console.log('Index success');
                    _d.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.addToIndices = addToIndices;
/**
 * Add records to Algolia Index
 * @param records
 */
function indexRecords(records) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, ALGOLIA_APP_ID, ALGOLIA_API_KEY, ALGOLIA_INDEX, client, index;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = process.env, ALGOLIA_APP_ID = _a.ALGOLIA_APP_ID, ALGOLIA_API_KEY = _a.ALGOLIA_API_KEY, ALGOLIA_INDEX = _a.ALGOLIA_INDEX;
                    if (!(ALGOLIA_APP_ID && ALGOLIA_API_KEY && ALGOLIA_INDEX)) {
                        throw new Error('Missing Configuration!');
                    }
                    client = algoliasearch_1.default(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
                    index = client.initIndex(ALGOLIA_INDEX);
                    return [4 /*yield*/, index.saveObjects(records, { autoGenerateObjectIDIfNotExist: false })];
                case 1:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function writeRecords(jsonFile, records) {
    var file = path.resolve(process.cwd(), jsonFile);
    var content = JSON.stringify(records);
    fs.writeFileSync(file, content, { encoding: 'utf8', flag: 'w' });
}
/**
 * Parse srt file
 * @param captionFile
 * @param encoding
 */
function parseSRT(captionFile, encoding) {
    var file = path.resolve(process.cwd(), captionFile);
    if (!fs.existsSync(file))
        throw new Error('File not exist');
    var buffer = fs.readFileSync(file);
    var content = iconv_lite_1.decode(buffer, encoding);
    return srt.parse(content);
}
/**
 * Convert captions to records
 * @param captions
 * @param uri
 * @param group
 * @param overlap
 */
function getRecords(captions, uri, group, overlap) {
    var e_1, _a;
    function getHashedId(uri, caption) {
        var data = "" + uri + caption.start + caption.end;
        return crypto_1.createHash("sha1").update(data).digest('base64');
    }
    function grouping(captions, len, overlap) {
        var step, i, buffer, start, end, caption;
        if (len === void 0) { len = 3; }
        if (overlap === void 0) { overlap = 0; }
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    step = Math.max(len - overlap, 1);
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < captions.length)) return [3 /*break*/, 4];
                    buffer = captions.slice(i, i + len);
                    start = buffer[0].start;
                    end = buffer[buffer.length - 1].end;
                    caption = {
                        start: start,
                        end: end,
                        duration: end - start,
                        content: buffer.map(function (item) { return item.content; }).join('\n')
                    };
                    return [4 /*yield*/, (caption)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i = i + step;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    }
    var result = [];
    try {
        for (var _b = __values(grouping(captions, group, overlap)), _c = _b.next(); !_c.done; _c = _b.next()) {
            var caption = _c.value;
            result.push(__assign({ objectID: getHashedId(uri, caption), uri: uri }, caption));
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return result;
}
