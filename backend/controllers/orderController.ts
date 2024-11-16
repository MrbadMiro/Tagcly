import { Request, Response } from "express";
import Order from "../models/orderModel";
import Product from "../models/productModel";

// Define a custom Request type to include `user` property
interface CustomRequest extends Request {
  user?: { _id: string };
}

// Utility Function
function calcPrices(orderItems: { price: number; qty: number }[]) {
  const itemsPrice = orderItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxRate = 0.15;
  const taxPrice = parseFloat((itemsPrice * taxRate).toFixed(2));

  const totalPrice = parseFloat(
    (itemsPrice + shippingPrice + taxPrice).toFixed(2)
  );

  return {
    itemsPrice: itemsPrice.toFixed(2),
    shippingPrice: shippingPrice.toFixed(2),
    taxPrice: taxPrice.toFixed(2),
    totalPrice: totalPrice.toFixed(2),
  };
}

// Create a new order
const createOrder = async (req: CustomRequest, res: Response) => {
  try {
    const { orderItems, shippingAddress, paymentMethod } = req.body;

    if (!orderItems || orderItems.length === 0) {
      res.status(400);
      throw new Error("No order items");
    }

    // Fetch items from DB
    const itemsFromDB = await Product.find({
      _id: { $in: orderItems.map((x: { _id: string }) => x._id) },
    });

    // Map client items to DB items
    const dbOrderItems = orderItems.map((itemFromClient: any) => {
      const matchingItemFromDB = itemsFromDB.find(
        (itemFromDB) =>
          (itemFromDB._id as unknown as string).toString() === itemFromClient._id
      );

      if (!matchingItemFromDB) {
        res.status(404);
        throw new Error(`Product not found: ${itemFromClient._id}`);
      }

      return {
        ...itemFromClient,
        product: itemFromClient._id,
        price: matchingItemFromDB.price,
      };
    });

    // Calculate prices
    const { itemsPrice, taxPrice, shippingPrice, totalPrice } = calcPrices(
      dbOrderItems
    );

    // Create order
    const order = new Order({
      orderItems: dbOrderItems,
      user: req.user?._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get all orders
const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({}).populate("user", "id username");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Get user orders
const getUserOrders = async (req: CustomRequest, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Count total orders
const countTotalOrders = async (req: Request, res: Response) => {
  try {
    const totalOrders = await Order.countDocuments();
    res.json({ totalOrders });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Calculate total sales
const calculateTotalSales = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find();
    const totalSales = orders.reduce((sum, order) => sum + order.totalPrice, 0);
    res.json({ totalSales });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Calculate total sales by date
const calculateTotalSalesByDate = async (req: Request, res: Response) => {
  try {
    const salesByDate = await Order.aggregate([
      {
        $match: {
          isPaid: true,
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$paidAt" },
          },
          totalSales: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.json(salesByDate);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Find order by ID
const findOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "username email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Mark order as paid
const markOrderAsPaid = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };

      const updatedOrder = await order.save();
      res.status(200).json(updatedOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Mark order as delivered
const markOrderAsDelivered = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ error: "Order not found" });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export {
  createOrder,
  getAllOrders,
  getUserOrders,
  countTotalOrders,
  calculateTotalSales,
  calculateTotalSalesByDate,
  findOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
};
