// Global error handling middleWare
const globalError = (err, req, res, next) =>{
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";
    if(process.env.NODE_ENV === "development"){
        sendErrorForDev(err, res);
    } else {
        sendErrorForPro(err, res);
    }

    
};
const sendErrorForDev = (err, res) =>{
    return res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
}



const sendErrorForPro = (err, res) =>{
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
    });
}
module.exports = globalError;