const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");
require("dotenv").config();
const UserFile = require("../models/userFiles");

// Initialize the S3 client outside the function to avoid re-creating it on every call
const s3 = new S3Client({
    region: "your-region", // e.g., 'ap-south-1'
    credentials: {
        accessKeyId: process.env.IAM_USER_KEY,
        secretAccessKey: process.env.IAM_USER_SECRET,
    },
});

exports.uploadToS3 = async (userId, filename, data) => {
    try {
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: "expensetrackerapp1",
                Key: filename,
                Body: data,
                ACL: "public-read",
            },
        });

        const result = await upload.done();
        console.log("File uploaded successfully:", result);

        await UserFile.create({
            userId,
            filename,
            fileUrl: result.Location,
        });

        return result.Location;
    } catch (err) {
        console.error("Error uploading file:", err);
        throw err;
    }
};
