import {OAuth2Client} from"google-auth-library";
import {AppError} from "../error/error.js";
const client = new OAuth2Client({client_id:process.env.GOOGLE_OAUTH_CLIENT_ID});
export async function verifyGoogleToken(idToken){
    try{
        const ticket =await client.verifyIdToken({
            idToken:idToken,
            audience:[env.google.webClientId,env.google.iosClientId]
        });
        return ticket.getPayload();
    }catch(err){
        throw new AppError('invalid google token',403);
    }
    
}