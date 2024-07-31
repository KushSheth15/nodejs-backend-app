require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// Configure Cloudinary with credentials from environment variables
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Function to upload a file to Cloudinary
const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;

    try {
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto' // Use 'image' if you're only uploading images
        });

        // File has been uploaded successfully
        console.log('File uploaded successfully:', response.url);
        // Optionally, you can unlink the file if you want to remove it after upload
        fs.unlinkSync(localFilePath); // Remove temporary file only if upload was successful

        return response;
    } catch (error) {
        console.error('Error uploading file:', error.message);
        // Optionally remove the local file if the upload failed
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath); // Remove the local file in case of an error
        }
        return null;
    }
};

module.exports = uploadOnCloudinary;
