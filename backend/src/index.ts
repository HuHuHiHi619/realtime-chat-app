import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { readdirSync } from 'fs';

dotenv.config()
const app = express()
const PORT = 5000


app.use(cors({
    origin: 'http://localhost:5173',
}))
app.use(express.json())
app.use(cookieParser())
app.get("/", (_req, res) => {
  res.send("Backend is running!");
});

console.log(process.env.DATABASE_URL);


app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});




export default app