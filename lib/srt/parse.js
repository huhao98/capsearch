"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
function parse(content) {
    var segments = content.split(/\r?\n\s*\r?\n/g);
    console.log("Found " + segments.length + " srt segments...");
    return segments.reduce(function (captions, part, i) {
        var caption = utils_1.toCaption(part);
        if (!caption) {
            console.log('unknow srt segment at', i);
        }
        return caption ? __spread(captions, [caption]) : captions;
    }, []);
}
exports.parse = parse;
;
