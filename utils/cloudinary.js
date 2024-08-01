require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) {
        console.warn('No file path provided for upload.');
        return null;
    }

    try {
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        console.log('File uploaded successfully:', response.url);
        return response;
    } catch (error) {
        console.error('Error uploading file:', error.message);
        return null;
    } finally {
        if (fs.existsSync(localFilePath)) {
            fs.unlink(localFilePath, (unlinkError) => {
                if (unlinkError) {
                    console.error('Error deleting local file:', unlinkError.message);
                } else {
                    console.log('Local file deleted successfully:', path.basename(localFilePath));
                }
            });
        }
    }
};

module.exports = uploadOnCloudinary;
