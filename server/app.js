import express from 'express';
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const app = express();
const PORT = 8085;

app.use(express.json())

const buildPath = path.join(_dirname, "build");

// checks if buildPath exits
if(fs.existsSync(buildPath)) {
    app.use(express.static(buildPath))
}

// React SOA fallback : send index.html for any route not starting with /api
app.get(/^\/(?!api).*/,(req,res)=> {
    res.sendFile(path.join(buildPath, "quickPoll.html"));
});

// API routes (only hit if path starts with /api)
app.get("/api/test",(req,res)=> {
    res.json({ message: "Hello from /api/test!"})
});

// General 404(non-API)
app.use((req,res)=> {
    res.status(404).send("404- Not Found.")
});

// Error handler
app.use((err,req,res,next)=> {
    console.log(err.stack);
    res.status(500).send("500- Internal Server Error")
});

// Start the server
app.listen(PORT,()=> {
    console.log(`Server is up and running on PORT: ${PORT}`)
});


