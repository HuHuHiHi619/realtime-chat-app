import "./types/express/index";  
import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import { readdirSync } from 'fs';
import http from 'http'
import { Server } from 'socket.io'
import { setupSocketHandlers } from './socket';
import { errorHandling } from './utils/errorHandling';


dotenv.config()
const app = express()
const server = http.createServer(app)
const PORT = 5000
const io = new Server(server , {
  cors: { origin: 'http://localhost:5173',  credentials: true , methods:['GET', 'POST'] }
}) 

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())

setupSocketHandlers(io)

const setUpRoutes = async () => {
  const routeFiles = readdirSync('./src/routes')
  for(const routeFile of routeFiles){
    const routeModule = await import(`./routes/${routeFile}`)
    app.use('/api', routeModule.default)
  }
}

const startServer = async () => {
  try{
    await setUpRoutes()
    app.use(errorHandling)
    server.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
  }catch(error){
    console.error('Failed to start server' , error)
    process.exit(1)
  }
}

startServer()

export default app