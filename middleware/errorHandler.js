export const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res.status(409).json({
        message: "Something went wrong",
        error: err.message
    });
}