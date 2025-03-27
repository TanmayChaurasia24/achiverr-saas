import { Router } from "express";
import {saveProfile} from "../controllers/Users.controller"
const router = Router();

router.post("/saveprofile", saveProfile)

export default router