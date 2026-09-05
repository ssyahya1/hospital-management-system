import express from "express";

import {
    createTransaction,
    getTransactions,
    getMyTransactions,
    getTransactionById,
    updateTransaction,
} from "../controllers/transactionController.js";

import { validateTransaction } from "../middleware/validateTransaction.js";
import { apiKeyMiddleware } from "../middleware/apiKeyMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateTransactionUpdate } from "../middleware/validateTransactionUpdate.js";

const router = express.Router();

router.post(
    "/",
    apiKeyMiddleware,
    authMiddleware,
    authorizeRoles("admin"),
    validateTransaction,
    createTransaction
);

router.get(
    "/",
    apiKeyMiddleware,
    authMiddleware,
    authorizeRoles("admin"),
    getTransactions

);
router.get(
    "/me",
    apiKeyMiddleware,
    authMiddleware,
    authorizeRoles("patient"),
    getMyTransactions
);

router.get(
    "/:id",
    apiKeyMiddleware,
    authMiddleware,
    getTransactionById
);

router.patch(
    "/:id",
    apiKeyMiddleware,
    authMiddleware,
    authorizeRoles("admin"),
    validateTransactionUpdate,
    updateTransaction
);
export default router;