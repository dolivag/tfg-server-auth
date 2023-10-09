import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config.js';

import { signUpRouter } from './routes/index.js';

const app = express();
app.use(bodyParser.json());
const port = process.env.PORT;

app.use(signUpRouter);

app.listen(port, async () => {
    console.log('Listening on port 3000.');
});

export default app;
