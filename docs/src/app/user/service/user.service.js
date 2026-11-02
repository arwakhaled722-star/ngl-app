import * as userRepository from '../repository/user.repository.js';
import { AppError } from '../../../lib/error/error.js';
export async function banUser(userId) {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new Error('User not found',404);
    }

    return userRepository.updateUserById(userId, {
        isBanned: true
    });
}