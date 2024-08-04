import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import client from 'prom-client';
import postRoute from './routes/post.routes.js'; // Ensure you have the correct file extension
import authRoute from './routes/auth.routes.js'; // Ensure you have the correct
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.routes.js";
import chatRoute from "./routes/chat.routes.js";
import messageRoute from "./routes/message.route.js";
import { requestCount } from './monitering/requestCount.js'; // Ensure you have the correct
import { requestGauge } from './monitering/requestGauge.js';
import { requestHistogram } from './monitering/requestHistogram.js';

const app = express();

app.use(cors({origin: process.env.CLIENT_URL, credentials:true})); // for handling cross-origin requests
app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies

app.use(requestCount); // Use the requestCount middleware
app.use(requestGauge); // Use the requestCount middleware
app.use(requestHistogram);

app.use("/api/users", userRoute);
app.use("/api/post", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);


app.get("/metrics", async (req, res) => {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.end(metrics);
})


app.listen(8800, () => {
    console.log('Server is running on port 8800');
});