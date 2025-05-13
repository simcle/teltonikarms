import express from 'express'
import { getAllPlcs } from "../controllers/plcController.js";

const router = express.Router()

router.get('/', getAllPlcs)


export default router