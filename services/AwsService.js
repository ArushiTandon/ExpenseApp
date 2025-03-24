const AWS = require('aws-sdk');
require('dotenv').config();
const UserFile = require('../models/userFiles');

exports.uploadToS3 = async (userId, filename, data) => {
    try {
        const Bucket_name = 'expensetrackerapp1';
        const IAM_USER_KEY = process.env.IAM_USER_KEY;
        const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

        const s3 = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        });

        const params = {
            Bucket: Bucket_name,
            Key: filename,
            Body: data,
            ACL: "public-read",
        };

        const result = await s3.upload(params).promise();
        console.log('File uploaded successfully:', result);

        await UserFile.create({
            userId,
            filename,
            fileUrl: result.Location
        });

        return result.Location;
    } catch (err) {
        console.error('Error uploading file:', err);
        throw err;
    }
};
