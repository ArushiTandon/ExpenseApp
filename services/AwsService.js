const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();
const UserFile = require('../models/userFiles');

exports.uploadToS3 = async (userId, filename, data) => {
    try {
        const Bucket_name = 'eptapp1';
        const IAM_USER_KEY = process.env.IAM_USER_KEY;
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

        // Create S3 client
        const s3Client = new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: IAM_USER_KEY,
                secretAccessKey: IAM_USER_SECRET
            }
        });

      
        const command = new PutObjectCommand({
            Bucket: Bucket_name,
            Key: filename,
            Body: data,
            ContentDisposition: 'attachment',
            ACL: 'public-read', 
        });

        const result = await s3Client.send(command);
        console.log('File uploaded successfully:', result);

        const fileUrl = `https://${Bucket_name}.s3.amazonaws.com/${filename}`;

        await UserFile.create({
            userId,
            filename,
            fileUrl
        });

        return fileUrl;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
    }
};
