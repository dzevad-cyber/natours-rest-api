import User from '../models/userModel.js';
import * as factory from '../utils/handlerFactory.js';

export const createUser = factory.createOne(User);
export const getUser = factory.getOne(User);
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
export const getAllUsers = factory.getAll(User);
