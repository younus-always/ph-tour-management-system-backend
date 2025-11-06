import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";
import multer from "multer";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import AppError from "../errorHelpers/AppError";
import stream from "stream";


const storage = new CloudinaryStorage({
      cloudinary: cloudinaryUpload,
      params: {
            public_id: (req, file) => {
                  const fileName = file.originalname
                        .toLowerCase()
                        .replace(/\s+/g, "-")
                        .replace(/\./g, "-")
                        .replace(/[^a-z0-9\-.]/g, "");

                  const extension = file.originalname.split(".").pop();
                  const uniqueFileName = `${Math.random().toString(36).substring(2)}"-"${Date.now()}"-"${fileName}"."${extension}`;

                  return uniqueFileName;
            }
      }
});

export const deleteImageFromCloudinary = async (url: string) => {
      try {
            const regex = /\/v\d+\/(.*?)\.(jpg|jpeg|png|gif|webp)$/i;
            const match = url.match(regex);

            if (match && match[1]) {
                  const public_id = match[1];
                  await cloudinary.uploader.destroy(public_id)
                  console.log(`File ${public_id} is deleted from cloudinary`);
            }
      } catch (error: any) {
            throw new AppError(400, "Cloudinary Image Deletion Failed", error.message)
      }
};

export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse | undefined> => {
      try {
            return new Promise((resolve, reject) => {
                  const public_id = `pdf/${fileName}-${Date.now()}`;
                  const bufferStream = new stream.PassThrough();
                  bufferStream.end(buffer);

                  cloudinary.uploader.upload_stream(
                        {
                              resource_type: "auto",
                              public_id: public_id,
                              folder: "pdf"
                        },
                        (err, result) => {
                              if (err) {
                                    return reject(err)
                              }
                              resolve(result)
                        }
                  ).end(buffer)
            })

      } catch (error: any) {
            console.log(error);
            throw new AppError(401, `Error uploading file ${error.message}`)
      }
};

export const multerUpload = multer({ storage: storage });