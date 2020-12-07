import express from 'express';

import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';
import * as authMiddleware from '../middlewares/authMiddleware.js';
import * as userMiddleware from '../middlewares/userMiddleware.js';

const router = express.Router();

router.route('/register').post(authController.register);
router.route('/login').post(authController.login);
router.route('/forgot-password').post(authController.forgotPassword);
router.route('/reset-password/:token').patch(authController.resetPassword);

router.use(authMiddleware.protect);

router.route('/update-password').patch(authController.updatePassword);

router.route('/update-me').patch(userController.updateMe);
router.route('/delete-me').delete(userController.deleteMe);

router.route('/me').get(userMiddleware.getMe, userController.getUser);

router.use(authMiddleware.restrictTo('admin'));

router
  .route('/')
  .post(userController.createUser)
  .get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .delete(userController.deleteUser)
  .patch(userController.updateUser);

export default router;
