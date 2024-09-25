import { Router } from 'express';
import {
    registerUser,
    login,
    getOne,
    updateProfile,
    addImage,
    logout
} from '../requestHandler/user';
import { authenticate } from '../middleware/authentication';
import upload from '../../core/utils/multer';

const router = Router();

router.post('/signup', registerUser);
router.post('/login', login);
router.get('/my-profile', authenticate, getOne);
router.put('/update-profile', authenticate, updateProfile);
router.put('/update-image', authenticate, upload.single("image"), addImage);
router.post('/logout-account', authenticate, logout);

export { router as userRoutes };
