import {v2 as cloudinary} from 'cloudinary'
import fs from 'fs'

cloudinary.config({ 
    // cloud_name: process.env.CLOUDANIRY_CLOUD_NAME, 
    // api_key: process.env.CLOUDANIRY_API_KEY, 
    // api_secret: process.env.CLOUDANIRY_API_SECR // Click 'View Credentials' below to copy your API secret
    cloud_name: 'dhnth3m4m', 
    api_key: '944414733482528', 
    api_secret: 'Bect4iYXYL-p5R_uwF5tOOpISh8'
});


const uploadOnCloudinary = async(localfilepath)=>{
    try {

        if(!localfilepath){
            return
        }
        

       const res= await cloudinary.uploader.upload(localfilepath,{
            resource_type: "auto"
        })
        
        fs.unlinkSync(localfilepath)
        console.log('file is uploaded');
        return res
        
    } catch (error) {
        fs.unlinkSync(localfilepath)
        return null
    }
}

export default uploadOnCloudinary


