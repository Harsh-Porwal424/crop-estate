import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import postRoute from './routes/post.routes.js'; // Ensure you have the correct file extension
import authRoute from './routes/auth.routes.js'; // Ensure you have the correct

const app = express();

app.use(express.json()); // for parsing application/json
app.use(cookieParser()); // for parsing cookies

app.use("/api/post", postRoute);
app.use("/api/auth", authRoute);


app.listen(8800, () => {
    console.log('Server is running on port 8800');
});