// const fs = () => {
//     return(req,res,next) => {
//         fs(req,res,next).catch(err => next(err));
//     }
// }


// module.exports = fs;



const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};

module.exports = catchAsync;