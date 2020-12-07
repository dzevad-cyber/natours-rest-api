import express from 'express';

const router = express.Router();

import * as userController from '../controllers/userController.js';

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
