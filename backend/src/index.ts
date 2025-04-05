import express from "express"
import "dotenv/config";
import userroutes from "./routes/user.route"
import roadmaproutes from "./routes/roadmap.route"
import goalroutes from "./routes/goals.route"
import todoroutes from "./routes/todo.route"
import cors from "cors"

const PORT = process.env.PORT || 5050
const app = express()
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:8081","https://achiverr.vercel.app/"],
    credentials: true,
    methods: ["GET", "POST", "PUT"]
}))
app.use('/api/user', userroutes)
app.use('/api/roadmap', roadmaproutes)
app.use('/api/goal', goalroutes)
app.use('/api/todo', todoroutes)

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
})