import { Application } from "https://deno.land/x/oak@v6.0.2/mod.ts";
import router from "./routes.ts";

const HOST = "0.0.0.0";
const PORT = 8000;

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log(`Listening on ${HOST}:${PORT}`);
await app.listen(`${HOST}:${PORT}`);
