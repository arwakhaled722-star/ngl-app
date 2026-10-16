import {user} from"../../user/model/user.model.js";
export async function checkUserExistsByEmail(email){
    return await user.findOne({email:email});

}
export async function createUser(userData){
        return await user.create(userData);
    }
    

