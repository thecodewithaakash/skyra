import imageKit from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new imageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

const fileUpload = async ({ buffer, fileName }) => {
  const response = await client.files.upload({
    file: buffer.toString("base64"), // convert buffer to base64
    fileName,
    folder: "snitch",
  });
  return response; 
};

export const deleteFile = async ({ fileId }) => {
  try {
    const result = await client.files.delete(fileId);
    return result;
  } catch (error) {
    console.log("error:", error);
  }
};

// export const updateFile = async({fileId}) => {
//   try {
//     const result = await client.files.update(fileId);
//     return result;
//   } catch (error) {
//     console.log("error",error);
//   }
// }

export default fileUpload;
