import * as userService from '../service/user.service.js';

export async function banUser(req, res, next) {
    try {
        const { userId } = req.params;

        const user = await userService.banUser(userId);

        res.json({
            message: 'User banned successfully',
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}