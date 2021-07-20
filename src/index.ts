/*
MIT License

Copyright (c) 2021 alexkar598

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import axios from "axios";

enum Mode {
    Start = "start",
    Stop = "stop"
}

const tgsurl = process.env.tgsurl || "http://localhost:5000";
const tgsusr = process.env.tgsusr || "admin";
const tgspwd = process.env.tgspwd || "ISolemlySwearToDeleteTheDataDirectory";
const tgsid = process.env.tgsid || "1"
const tgsmode = process.env.tgsmode as Mode || Mode.Stop



console.log(`Starting at ${(new Date()).toUTCString()}`);
console.log(`TGS Endpoint: ${tgsurl}`);
console.log(`TGS User: ${tgsusr}`);
console.log(`TGS Instance: ${tgsid}`);
console.log(`TGS Action: ${tgsmode}`)

//complete interface
interface TGSToken {
    bearer: string,
    expiresAt: string
}

//partial interface
interface TGSJob {
    id: number,
    description: string
}

(async () => {
    let tgstoken: string;

    console.log("Creating Axios instance")
    const instance = axios.create({
        baseURL: tgsurl,
        headers: {
            "Accept": "application/json",
            "api": `Tgstation.Server.Api/6.6.0`,
            "User-Agent": "serverscheduler/0.0.1"
        }
    })
    instance.interceptors.request.use(
        async value => {
            if (!((value.url === "/" || value.url === "") && value.method === "post")) {
                (value.headers as { [key: string]: string })["Authorization"] =
                    "Bearer " + tgstoken;
            }
            return value;
        },
        error => {
            return Promise.reject(error);
        });

    console.log("Logging in into TGS")
    try {
        const response: TGSToken = ((await instance.post("/", null, {
            auth: {
                username: tgsusr,
                password: tgspwd
            }
        })).data);
        tgstoken = response.bearer;
    } catch(e) {
        console.error("Error while logging in to TGS", e)
        process.exit(1);
    }

    switch (tgsmode) {
        case Mode.Start: {
            console.log(`Attempting to start instance`)
            try {
                const response: TGSJob = ((await instance.put("/DreamDaemon", null, {
                    headers: {
                        instance: tgsid
                    }
                })).data);
                console.log(`Started job ${response.id}: ${response.description}`)
            } catch(e) {
                console.error("Error while starting instance", e)
                process.exit(1);
            }
            console.log(`Unsetting graceful shutdown`);
            try {
                await instance.post("/DreamDaemon", {softShutdown: false}, {
                    headers: {
                        instance: tgsid
                    }
                });
                console.log(`Graceful shutdown unset`)
            } catch(e) {
                console.error("Error while unsetting graceful shutdown", e)
                process.exit(1);
            }
            break;
        }
        case Mode.Stop: {
            console.log(`Setting graceful shutdown`);
            try {
                await instance.post("/DreamDaemon", {softShutdown: true}, {
                    headers: {
                        instance: tgsid
                    }
                });
                console.log(`Graceful shutdown set`)
            } catch(e) {
                console.error("Error while setting graceful shutdown", e)
                process.exit(1);
            }
            break;
        }
        default: {
            console.error(`Unknown action: ${tgsmode}`)
            process.exit(1);
        }
    }
})();
