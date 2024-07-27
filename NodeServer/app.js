import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

export const app = express();

app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ limit: 'kb', extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN,
    credentials: true,
  })
);
app.use(express.static('public'));
