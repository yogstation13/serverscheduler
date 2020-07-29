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

//partial interface
interface TGSInstance {
    softShutdown: boolean
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
            break;
        }
        case Mode.Stop: {
            console.log(`Fetching instance info`)
            try {
                const response: TGSInstance = ((await instance.get("/DreamDaemon", {
                    headers: {
                        instance: tgsid
                    }
                })).data);
                console.log(`Setting graceful shutdown`);
                response.softShutdown = true;
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
            } catch(e) {
                console.error("Error while fetching instance", e)
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