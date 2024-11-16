import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
} from "../controllers/orderController";

import { authenticate, authorizeAdmin } from "../middlewares/authMiddileware";

// Route for creating a new order and getting all orders (admin-only)
router
  .route("/")
  .post(authenticate, createOrder)
  .get(authenticate, authorizeAdmin, getAllOrders);

// Route for getting user's own orders
router.route("/mine").get(authenticate, getUserOrders);

// Route for getting the total number of orders
router.route("/total-orders").get(countTotalOrders);

// Route for calculating total sales
router.route("/total-sales").get(calculateTotalSales);

// Route for calculating total sales by date
router.route("/total-sales-by-date").get(calculateTotalSalesByDate);

// Route for getting a specific order by ID
router.route("/:id").get(authenticate, findOrderById);

// Route for marking an order as paid
router.route("/:id/pay").put(authenticate, markOrderAsPaid);

// Route for marking an order as delivered (admin-only)
router
  .route("/:id/deliver")
  .put(authenticate, authorizeAdmin, markOrderAsDelivered);

export default router;
