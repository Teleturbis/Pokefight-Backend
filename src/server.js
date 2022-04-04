import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';

import { routesUser } from './routes/user';
import { routesOrder } from './routes/order';
import { BadRequestError, NotFoundError } from './js/HttpError';
import logRequest from './middleware/logRequest';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

console.log('NODE_ENV >> ', process.env.NODE_ENV);

const app = express();

const PORT = process.env.PORT ?? 3001;

/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());

/** middlewares */
app.use(cors());
app.use(morgan('dev'));

app.use(logRequest);

/** Routes */
app.use('/user', routesUser);
app.use('/order', routesOrder);

/** images & co */
app.use(express.static('public'));

/** Error handling */
app.use((error, req, res, next) => {
  console.log(error);
  let status = 500;
  let errorMsg = '';
  if (error instanceof BadRequestError) {
    status = error.code;
    errorMsg = error.errorObj;
  } else if (error instanceof NotFoundError) {
    status = error.code;
    errorMsg = { error: error.message };
  } else if (error instanceof Error) {
    errorMsg = { error: error.message };
  } else errorMsg = error;

  console.log('error-middleware', errorMsg);

  return res.status(status).json(errorMsg);
});

// console.log(process.env.DB_CONFIG);

/** Server */
const httpServer = http.createServer(app);
httpServer.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
  console.log(`Example: http://localhost:${PORT}/user/1`);
});
