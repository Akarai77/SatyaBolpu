import { Request, Response} from 'express';
import { Culture, ICulture } from '../models/Cuture.js';

export const getCultures = async (req: Request, res: Response) => {
  try {
    const cultures: ICulture[] | null = await Culture.find();
    if(!cultures) {
      return res.status(404).json({ msg: 'No cultures found.' });
    }

    return res.status(200).json({ cultures });
  } catch(err: any) {
    console.error("Get Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching cultures.' });
  }
}

export const getCulture = async (req: Request, res: Response) => {
  try {
    let { name } = req.params;
    name = name.charAt(0).toUpperCase() + name.slice(1,name.length);
    const culture: ICulture | null = await Culture.findOne({ name });
    if(!culture) {
      return res.status(404).json({ msg: 'No culture found.' });
    }

    return res.status(200).json({ culture });
  } catch(err: any) {
    console.error("Get Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while fetching cultures.' });
  }
}

export const uploadCulture = async (req: Request, res: Response) => {
  try {
    const { name, descr, image } = req.body;
    if(!name || !descr || !image) {
      return res.status(400).json({ msg: 'Missing required field.' });
    }

    const doesExist = await Culture.findOne({ name });
    if(doesExist) {
      return res.status(400).json({ msg: `Culture '${name}' already exists.` })
    }

    const newCulture = await Culture.create({ name, descr, image, posts: 0 });
    return res.status(200).json({ culture: newCulture });   
  } catch(err: any) {
    console.error("Upload Cultures Error: " + err.message);
    return res.status(500).json({ msg: 'Internal Server Error while uploading culture.' });
  }
}
