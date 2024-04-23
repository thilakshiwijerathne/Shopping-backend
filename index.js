const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Database connection with MongoDB
mongoose.connect("mongodb+srv://thilakshiwijerathne55:ATZ3wwQB4VtLb0YJ@cluster0.aiflsvd.mongodb.net/Bliss", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Image Storage engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

// Creating upload endpoint for images
app.use('http://localhost:4000/images', express.static('upload/images'));

// Product schema
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  new_price: {
    type: Number,
    required: true
  },
  old_price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  available: {
    type: Boolean,
    default: true
  },
});

// Add product endpoint
app.post('http://localhost:4000/addproduct', async (req, res) => {
  try {
    let products = await Product.find({});
    let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

    const product = new Product({
      id: id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();
    console.log("Product saved:", product);
    res.json({
      success: true,
      name: req.body.name
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// Remove product endpoint
app.post('http://localhost:4000/removeproduct', async (req, res) => {
  try {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Product removed:", req.body.name);
    res.json({
      success: true,
      name: req.body.name
    });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

// Get all products endpoint
app.get('http://localhost:4000/allproducts', async (req, res) => {
  try {
    let products = await Product.find({});
    console.log("All Products fetched");
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error"
    });
  }
});

app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port", port);
  } else {
    console.log("Error:", error);
  }
});
