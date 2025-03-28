import express from "express"
import "dotenv/config";
import userroutes from "./routes/user.route"
import roadmaproutes from "./routes/roadmap.route"
import goalroutes from "./routes/goals.route"

const PORT = process.env.PORT || 5050
const app = express()
app.use(express.json())

app.use('/api/user', userroutes)
app.use('/api/roadmap', roadmaproutes)
app.use('/api/goal', goalroutes)

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
    
})