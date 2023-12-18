module.exports = (fun) => {
    //1. Accept the async function
    return (req, res, next) => {

        //2. If any rejected promises global error hanler will exectuted and any code in next queue will be rejected
        fun(req, res, next).catch(err => next(err));
        
    }
}