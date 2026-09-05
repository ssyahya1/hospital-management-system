export const validateTransaction = (req, res, next) => {
    const {
        patient_id,
        amount,
        transaction_type,
        status
    } = req.body;

    if (
        patient_id === undefined ||
        typeof patient_id !== "number" ||
        patient_id <= 0
    ) {
        return res.status(400).json({
            message: "Invalid patient_id. It must be a positive number."
        });
    }
    if (
        amount === undefined ||
        typeof amount !== "number" ||
        amount <= 0
    ) {
        return res.status(400).json({
            message: "Invalid amount. It must be a positive number."
        });
    }

    const validTypes = ["consultation", "medicine","lab","other"];
    if (
        transaction_type === undefined ||
        typeof transaction_type !== "string" ||
        !validTypes.includes(transaction_type)
    ) {
        return res.status(400).json({
            message: "Invalid transaction_type."
        });
    }
    if (
        status !== undefined
    ) {
        const validStatuses = ["pending", "completed", "cancelled"];
        if (
            typeof status !== "string" ||
            !validStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid status. Use pending, completed, or cancelled."
            });
        }
    }

    next();
};