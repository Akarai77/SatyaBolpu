import { Request, Response } from "express";
import { Tag } from "../models/Tag.js";

export const getTags = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();
    if (!tags) {
      res.status(404).json({ msg: 'No tags found' });
    }

    return res.status(200).json({
      tags: tags
    })
  } catch (err: any) {
    console.error("Error while fetching tags: " + err);
    return res.status(500).json({ msg: 'Server error while fetching tags' });
  }
}
