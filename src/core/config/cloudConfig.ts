import { v2 as cloudinary } from 'cloudinary';
import variable from '../envVariables/environment';

// Configure Cloudinary
cloudinary.config({ 
  cloud_name: variable.CLOUD_NAME, 
  api_key: variable.CLOUD_KEY, 
  api_secret: variable.CLOUD_SECRETE,
});

export default cloudinary;
