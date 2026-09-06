export const notFound=(_req,res)=>res.status(404).json({error:'Rota não encontrada.'});
export const errors=(err,_req,res,_next)=>{if(err.code?.startsWith('SQLITE_CONSTRAINT'))return res.status(409).json({error:'Operação viola uma restrição de dados.'});console.error(err);return res.status(500).json({error:'Erro interno do servidor.'});};
