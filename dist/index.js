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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var Mode;
(function (Mode) {
    Mode["Start"] = "start";
    Mode["Stop"] = "stop";
})(Mode || (Mode = {}));
var tgsurl = process.env.tgsurl || "http://localhost:5000";
var tgsusr = process.env.tgsusr || "admin";
var tgspwd = process.env.tgspwd || "ISolemlySwearToDeleteTheDataDirectory";
var tgsid = process.env.tgsid || "1";
var tgsmode = process.env.tgsmode || Mode.Stop;
console.log("Starting at " + (new Date()).toUTCString());
console.log("TGS Endpoint: " + tgsurl);
console.log("TGS User: " + tgsusr);
console.log("TGS Instance: " + tgsid);
console.log("TGS Action: " + tgsmode);
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var tgstoken, instance, response, e_1, _a, response, e_2, response, e_3, e_4;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log("Creating Axios instance");
                instance = axios_1.default.create({
                    baseURL: tgsurl,
                    headers: {
                        "Accept": "application/json",
                        "api": "Tgstation.Server.Api/7.0.0",
                        "User-Agent": "serverscheduler/0.0.1"
                    }
                });
                instance.interceptors.request.use(function (value) { return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        if (!((value.url === "/" || value.url === "") && value.method === "post")) {
                            value.headers["Authorization"] =
                                "Bearer " + tgstoken;
                        }
                        return [2 /*return*/, value];
                    });
                }); }, function (error) {
                    return Promise.reject(error);
                });
                console.log("Logging in into TGS");
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, instance.post("/", null, {
                        auth: {
                            username: tgsusr,
                            password: tgspwd
                        }
                    })];
            case 2:
                response = ((_b.sent()).data);
                tgstoken = response.bearer;
                return [3 /*break*/, 4];
            case 3:
                e_1 = _b.sent();
                console.error("Error while logging in to TGS", e_1);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4:
                _a = tgsmode;
                switch (_a) {
                    case Mode.Start: return [3 /*break*/, 5];
                    case Mode.Stop: return [3 /*break*/, 10];
                }
                return [3 /*break*/, 19];
            case 5:
                console.log("Attempting to start instance");
                _b.label = 6;
            case 6:
                _b.trys.push([6, 8, , 9]);
                return [4 /*yield*/, instance.put("/DreamDaemon", null, {
                        headers: {
                            instance: tgsid
                        }
                    })];
            case 7:
                response = ((_b.sent()).data);
                console.log("Started job " + response.id + ": " + response.description);
                return [3 /*break*/, 9];
            case 8:
                e_2 = _b.sent();
                console.error("Error while starting instance", e_2);
                process.exit(1);
                return [3 /*break*/, 9];
            case 9: return [3 /*break*/, 20];
            case 10:
                console.log("Fetching instance info");
                _b.label = 11;
            case 11:
                _b.trys.push([11, 17, , 18]);
                return [4 /*yield*/, instance.get("/DreamDaemon", {
                        headers: {
                            instance: tgsid
                        }
                    })];
            case 12:
                response = ((_b.sent()).data);
                console.log("Setting graceful shutdown");
                response.softShutdown = true;
                _b.label = 13;
            case 13:
                _b.trys.push([13, 15, , 16]);
                return [4 /*yield*/, instance.post("/DreamDaemon", { softShutdown: true }, {
                        headers: {
                            instance: tgsid
                        }
                    })];
            case 14:
                _b.sent();
                console.log("Graceful shutdown set");
                return [3 /*break*/, 16];
            case 15:
                e_3 = _b.sent();
                console.error("Error while setting graceful shutdown", e_3);
                process.exit(1);
                return [3 /*break*/, 16];
            case 16: return [3 /*break*/, 18];
            case 17:
                e_4 = _b.sent();
                console.error("Error while fetching instance", e_4);
                process.exit(1);
                return [3 /*break*/, 18];
            case 18: return [3 /*break*/, 20];
            case 19:
                {
                    console.error("Unknown action: " + tgsmode);
                    process.exit(1);
                }
                _b.label = 20;
            case 20: return [2 /*return*/];
        }
    });
}); })();
//# sourceMappingURL=index.js.map