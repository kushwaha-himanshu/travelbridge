import express from 'express';
import {main} from '../services/tripplanner.service.js';

const router=express.Router();

router.get('/chatcompletion', async (req, res) => {
  try {
    const result = await main();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
export default router;