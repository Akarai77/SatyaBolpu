import { Request, Response } from "express";

export const uploadController = async (req: Request, res: Response) => {
  try {
    console.log(req)
    const file = req.file;
    if(!file) {
      console.warn("No file received in request.");
      return res.status(400).json({ msg: "Missing File." });
    }

    console.log("Uploaded file",file.path);
    return res.status(200).json({ msg: 'Upload Successful', path: file.path })
  } catch (err: any) {
    console.error("Error during file upload:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
