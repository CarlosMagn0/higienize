import jwt from 'jsonwebtoken';
const secret=()=>process.env.JWT_SECRET||'desenvolvimento-higienize';
export const authenticate=(req,res,next)=>{const token=req.headers.authorization?.replace(/^Bearer\s+/i,'');if(!token)return res.status(401).json({error:'Token de autenticação obrigatório.'});try{req.user=jwt.verify(token,secret());next();}catch{return res.status(401).json({error:'Token inválido ou expirado.'});}};
export const authorize=(...roles)=>(req,res,next)=>roles.includes(req.user.role)?next():res.status(403).json({error:'Acesso não autorizado para este perfil.'});
export const issueToken=(user)=>jwt.sign({id:user.id,role:user.role,name:user.name},secret(),{expiresIn:'8h'});
