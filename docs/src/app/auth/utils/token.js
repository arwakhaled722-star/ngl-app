import jwt from 'jsonwebtoken';
export function generateToken(payload){
    return jwt.sign(
            payload,
            process.env.SECRET_KEY,
            {expiresIn:toMs(1 ,'hours')}
    );
    
}