export const validateTransactionUpdate = (req, res, next) => {

    const { status } = req.body;

    if (status === undefined) {
        return res.status(400).json({
            message: "Status is required"
        });
    }

    const validStatuses = [
        "pending",
        "completed",
        "cancelled"
    ];

    if (
        typeof status !== "string" ||
        !validStatuses.includes(status)
    ) {
        return res.status(400).json({
            message: "Invalid status. Use pending, completed, or cancelled."
        });
    }

    next();
};