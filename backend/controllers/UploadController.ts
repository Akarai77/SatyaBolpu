import { Request, Response } from "express";

export const uploadController = async (req: Request, res: Response) => {
  try {
    const file = req.file;
    if(!file) {
      console.warn("No file received in request.");
      return res.status(400).json({ msg: "Missing File." });
    }

    const fileUrl = `/${file.destination}/${file.filename}`.replace(/\\/g, "/");
    console.log("Uploaded file",fileUrl);
    return res.status(200).json({ msg: 'Upload Successful', path: fileUrl })
  } catch (err: any) {
    console.error("Error during file upload:", err);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
}
