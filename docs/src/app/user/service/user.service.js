import * as userRepository from '../repository/user.repository.js';

export async function banUser(userId) {
    const user = await userRepository.findUserById(userId);

    if (!user) {
        throw new Error('User not found');
    }

    return userRepository.updateUserById(userId, {
        isBanned: true
    });
}