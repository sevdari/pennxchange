const AWS = require('aws-sdk');

// dotenv helps manage environment variables
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// The name of the bucket that you have created
const BUCKET_NAME = 'pennxchange';

// we load credentials from the .env file
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ID,
  secretAccessKey: process.env.AWS_SECRET,
});
// upload a file
const uploadFile = async (fileContent, fileName) => {
  // Setting up S3 upload parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // File name we want to upload
    Body: fileContent,
  };

  // Uploading files to the bucket
  const data = await s3.upload(params).promise();
  return data.Location;
};

// delete a file - not needed at the moment
/*
const deleteFile = (fileName) => {
  // Setting up S3 delete parameters
  const params = {
    Bucket: BUCKET_NAME,
    Key: fileName, // File name we want to delete
  };

  // download file from the bucket
  s3.deleteObject(params, (err, data) => {
    if (err) {
      // throw err;
      return false;
    }
    return true;
  });
};
*/

module.exports = { uploadFile };
