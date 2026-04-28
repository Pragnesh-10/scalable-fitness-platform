const { validationResult } = require('express-validator');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // #region agent log
    fetch('http://127.0.0.1:7496/ingest/dcb48f73-c783-41f0-88dd-afd6dcce3d77',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'cbc9f3'},body:JSON.stringify({sessionId:'cbc9f3',runId:'register-debug',hypothesisId:'H6',location:'backend/middleware/validate.js:6',message:'validation middleware rejected request',data:{path:req.path,method:req.method,errorCount:errors.array().length,errorFields:errors.array().map((e)=>e.path).slice(0,5)},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { validate };
