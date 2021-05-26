import express from "express"
import cors from "cors"
import listEndpoints from "express-list-endpoints"
import authorsRoutes from "./authors/index.js"
import { notFound, forbidden, catchAllErrorHandler } from "./errorHandlers.js"
import blogsRoutes from "./blogs/index.js"

const server = express()
const PORT = 3001

server.use(cors())

server.use(express.json())

// ROUTES

server.use("/authors", authorsRoutes)

server.use("/blogs", blogsRoutes)

//  next(err) --> ERROR HANDLERS
server.use(notFound)

server.use(forbidden)

server.use(catchAllErrorHandler)

console.table(listEndpoints(server))

server.listen(PORT, () => console.log('server is running on PORT ', PORT))

server.on("error", (error) => console.log(`server is not running due to ${error}`))