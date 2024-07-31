import express from 'express';
import postRoute from './routes/post.routes.js'; // Ensure you have the correct file extension

const app = express();

app.use("/api/post", postRoute);

app.listen(8800, () => {
    console.log('Server is running on port 8800');
});