import express from "express";

import {
    createTransaction,
    getTransactions,
    getMyTransactions,
    getTransactionById,
    updateTransaction,
} from "../controllers/transactionController.js";

import { validateTransaction } from "../middleware/validateTransaction.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { validateTransactionUpdate } from "../middleware/validateTransactionUpdate.js";

const router = express.Router();

router.post(
    "/",
    
    authMiddleware,
    authorizeRoles("admin"),
    validateTransaction,
    createTransaction
);

router.get(
    "/",
   
    authMiddleware,
    authorizeRoles("admin"),
    getTransactions

);
router.get(
    "/me",
    
    authMiddleware,
    authorizeRoles("patient"),
    getMyTransactions
);

router.get(
    "/:id",
    
    authMiddleware,
    getTransactionById
);

router.patch(
    "/:id",

    authMiddleware,
    authorizeRoles("admin"),
    validateTransactionUpdate,
    updateTransaction
);
export default router;