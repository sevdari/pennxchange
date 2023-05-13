/**
 * Express webserver / controller
 */

// import express
const express = require('express');

// import the cors - cross origin resource sharing module
const cors = require('cors');

const bodyParser = require('body-parser');

// create a new express app
const webapp = express();

// enable cors
webapp.use(cors());

// configure express to parse request body
webapp.use(express.urlencoded({ extended: true }));

webapp.use(bodyParser.json());

// import formidable
const formidable = require('formidable');

// import fs
const fs = require('fs');

// import S3 operations
const s3 = require('./utils/S3_operations');

// import the db function
const reviewDB = require('./model/reviewDB');
const userDB = require('./model/userDB');
const wishlistDB = require('./model/wishlistDB');
const productDB = require('./model/productDB');
const messageDB = require('./model/messageDB');

// authentication functions
const { authenticateUser, getPennIdFromToken } = require('./utils/auth');

// Login endpoint
webapp.post('/login', async (req, res) => {
  // check pennId and password in the request body
  if (!req.body.pennId || !req.body.password) {
    res.status(400).json({ message: 'missing username or password' });
    return;
  }
  try {
    // create a token
    const token = await authenticateUser(req.body.pennId, req.body.password);
    if (token === null) {
      res.status(401).json({ message: 'invalid username or password' });
      return;
    }
    // send the token
    res.status(201).json({ apptoken: token });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation GET /review/:id
webapp.get('/review/:id', async (req, res) => {
  try {
    // get the data from the DB
    const review = await reviewDB.getReviewById(req.params.id);
    if (review === undefined || review === null) {
      res.status(404).json({ error: 'unknown review' });
      return;
    }
    // send response
    res.status(200).json({ data: review });
  } catch (err) {
    // send the error code
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation GET /review
webapp.get('/sellerReview/:sellerId', async (req, res) => {
  try {
    const review = await reviewDB.getReviewsBySellerId(req.params.sellerId);
    if (review === undefined || review === null) {
      res.status(404).json({ error: 'unknown seller' });
    }
    res.status(200).json({ data: review });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation POST /review
webapp.post('/review', async (req, res) => {
  if (!req.body) {
    res.status(404).json({ message: 'missing object' });
    return;
  }
  const newReview = {
    buyerId: parseInt(req.body.buyerId, 10),
    sellerId: parseInt(req.body.sellerId, 10),
    rating: parseInt(req.body.rating, 10),
    content: req.body.content,
    time: req.body.time,
  };
  try {
    const result = await reviewDB.addReview(newReview);
    res.status(201).json({ data: { id: result } });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation PUT /review/:id
webapp.put('/review/:id', async (req, res) => {
  if (!req.body) {
    res.status(404).json({ message: 'missing object' });
    return;
  }
  const modifiedReview = {
    rating: parseInt(req.body.rating, 10),
    content: req.body.content,
    time: req.body.time,
  };
  try {
    const result = await reviewDB.updateReview(req.params.id, modifiedReview);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation DELETE /review/:id
webapp.delete('/review/:id', async (req, res) => {
  try {
    const result = await reviewDB.deleteReview(req.params.id);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// get all messages
webapp.get('/message', async (req, res) => {
  try {
    const result = await messageDB.getMessages();
    if (!result) {
      res.status(404).json({ message: 'The API call failed' });
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error.' });
  }
});

// get all messages for a user
webapp.get('/message/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ message: 'No ID provided' });
    return null;
  }
  try {
    const result = await messageDB.getMessagesId(req.params.id);
    if (result.length === 0) {
      res.status(404).json({ message: 'No messages for this user' });
      return null;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error.' });
  }
  return null;
});

// upload a message
webapp.post('/message', async (req, res) => {
  if (!req.body.sender || !req.body.receiver || !req.body.time || !req.body.content) {
    res.status(404).json({ message: 'Missing attributes' });
    return null;
  }
  try {
    const newMessage = {
      sender: parseInt(req.body.sender, 10),
      receiver: parseInt(req.body.receiver, 10),
      time: req.body.time,
      content: req.body.content,
    };
    const result = await messageDB.addMessage(newMessage);
    if (!result) {
      res.status(404).json({ message: 'API call failed' });
      return null;
    }
    res.status(200).json({ data: { id: result } });
  } catch (err) {
    res.status(400).json({ message: 'There was an error.' });
  }
  return null;
});

// upload endpoint with formidable
webapp.post('/upload/', async (req, res) => {
  const form = formidable({ multiples: true }); // { multiples: true });

  const processFile = async (files, key) => new Promise((resolve, reject) => {
    let cacheBuffer = Buffer.alloc(0);
    const fStream = fs.createReadStream(files[key].filepath);
    fStream.on('data', (chunk) => {
      cacheBuffer = Buffer.concat([cacheBuffer, chunk]);
    });
    fStream.on('end', async () => {
      try {
        const s3URL = await s3.uploadFile(cacheBuffer, files[key].originalFilename);
        resolve(s3URL);
      } catch (error) {
        reject(error);
      }
    });
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(404).json({ error: err.message });
    }
    const keyArray = Object.keys(files);
    const uploadPromises = keyArray.map((key) => processFile(files, key));

    try {
      const urls = await Promise.all(uploadPromises);
      res.status(201).json({ data: urls });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// route implementation GET wishlist/:id
webapp.get('/wishlist/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ message: 'missing pennID' });
    return;
  }
  try {
    const wishlist = await wishlistDB.getWishlist(req.params.id);
    res.status(200).json({ data: wishlist });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation PUT wishlist/:id/:productId
webapp.put('/wishlist/:id/:productId', async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ message: 'missing pennID' });
    return;
  }
  if (!req.params.productId) {
    res.status(404).json({ message: 'missing productId' });
    return;
  }
  try {
    const result = await wishlistDB.addWishlist(req.params.id, req.params.productId);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation DELETE wishlist/:id/:productId
webapp.delete('/wishlist/:id/:productId', async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ message: 'missing pennID' });
    return;
  }
  if (!req.params.productId) {
    res.status(404).json({ message: 'missing productId' });
    return;
  }
  try {
    const result = await wishlistDB.deleteWishlist(req.params.id, req.params.productId);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation GET product/:keyword
webapp.get('/search/:keyword', async (req, res) => {
  if (!req.params.keyword) {
    res.status(404).json({ error: 'No keyword provided' });
    return;
  }
  try {
    const results = await productDB.searchProduct(req.params.keyword);
    if (!results) {
      res.status(404).json({ error: 'API call error' });
      return;
    }
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(400).json({ error: 'There was an error' });
  }
});

// route implementation GET product/:id
webapp.get('/product/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: 'Missing id' });
  }
  try {
    const results = await productDB.getProduct(req.params.id);
    if (!results) {
      res.status(404).json({ error: 'Unknown product' });
      return;
    }
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(400).json({ error: 'There was an error' });
  }
});

// route implementation GET product
// webapp.get('/product', async (req, res) => {
//   try {
//     const results = await productDB.getPostedProducts(req.params.id);
//     res.status(200).json({ data: results });
//   } catch (err) {
//     res.status(404).json({ error: 'There was an error' });
//   }
// });

// route implementation GET product
webapp.get('/product', async (req, res) => {
  try {
    const results = await productDB.getAllProducts();
    if (!results) {
      res.status(404).json({ error: 'API call failed' });
      return;
    }
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(400).json({ error: 'There was an error' });
  }
});

// route implementation POST product
webapp.post('/product', async (req, res) => {
  if (!req.body.productName || !req.body.productImage || !req.body.productDescription
    || !req.body.productCategory || !req.body.productPrice || !req.body.productCondition) {
    res.status(404).json({ message: 'Missing name, image, description, category, price, or condition' });
    return;
  }
  try {
    const newProduct = {
      productName: req.body.productName,
      productImage: req.body.productImage,
      productDescription: req.body.productDescription,
      productCategory: req.body.productCategory,
      productPrice: parseFloat(req.body.productPrice),
      productPostedDate: req.body.productPostedDate,
      productCondition: req.body.productCondition,
      productSeller: req.body.productSeller,
    };
    const result = await productDB.makeProduct(newProduct);
    if (!result) {
      res.status(404).json({ error: 'API call failed' });
      return;
    }
    res.status(201).json({ data: { id: result } });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementatin of GET /user
webapp.get('/allUsers', async (req, res) => {
  try {
    const users = await userDB.getAllUsers();
    if (!users) {
      res.status(404).json({ error: 'No users' });
      return;
    }
    res.status(200).json({ data: users });
  } catch (err) {
    res.status(400).json({ message: 'There was an erorr' });
  }
});

// route implementation GET /user/:pennId
webapp.get('/user/:pennId', async (req, res) => {
  try {
    const user = await userDB.getUserId(req.params.pennId);
    if (!user) {
      res.status(404).json({ error: 'unknown user' });
      return;
    }
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation GET /user/username/:username
webapp.get('/user/username/:username', async (req, res) => {
  try {
    const user = await userDB.getUserByUsername(req.params.username);
    if (!user) {
      res.status(404).json({ error: 'unknown user' });
      return;
    }
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation POST /user
webapp.post('/user', async (req, res) => {
  // validate the request body
  if (!req.body.username || !req.body.password || !req.body.pennId || !req.body.email) {
    res.status(400).json({ message: 'missing username, password, pennId or email' });
    return;
  }
  try {
    const result = await userDB.createUser(req.body);
    if (!result) {
      res.status(400).json({ message: 'There was an error' });
      return;
    }
    res.status(201).json({ data: { id: result } });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implemention PUT user/:id
webapp.put('/user/:id', async (req, res) => {
  if (!req.body.pennId) {
    res.status(404).json({ message: 'User ID not provided' });
    return;
  }
  if (!req.body.username || !req.body.password || !req.body.picture) {
    res.status(404).json({ message: 'Missing username, password, picture' });
    return;
  }
  try {
    const result = await userDB.changeUser(req.params.id, req.body);
    if (!result) {
      res.status(404).json({ message: 'User not updated' });
      return;
    }
    res.status(200).json({ message: 'Success' });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation PUT product/:id
webapp.put('/product/:id', async (req, res) => {
  if (!req.body.productName || !req.body.productImage || !req.body.productDescription
    || !req.body.productCategory || !req.body.productPrice || !req.body.productPostedDate
    || !req.body.productCondition || !req.body.productSeller) {
    res.status(404).json({ message: 'Missing name, image, description, category, price, or condition' });
    return;
  }
  try {
    const updatedProduct = {
      productName: req.body.productName,
      productImage: req.body.productImage,
      productDescription: req.body.productDescription,
      productCategory: req.body.productCategory,
      productPrice: req.body.productPrice,
      productPostedDate: req.body.productPostedDate,
      productCondition: req.body.productCondition,
      productSeller: req.body.productSeller,
    };
    const result = await productDB.updateProduct(req.params.id, updatedProduct);
    if (!result) {
      res.status(404).json({ error: 'API call failed' });
      return;
    }
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

webapp.delete('/product/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: 'No product ID provided' });
  }
  try {
    const result = await productDB.deleteProduct(req.params.id);
    // if (result.deletedCount === 0) {
    //   res.status(404).json({ error: 'Product not in the system' });
    //   return;
    // }
    if (!result) {
      res.status(404).json({ error: 'API call failed' });
      return;
    }
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation GET contacts/:id
webapp.get('/contacts/:id', async (req, res) => {
  if (!req.params.id) {
    res.status(404).json({ error: 'No id given' });
  }
  try {
    const result = await messageDB.getContacts(req.params.id);
    if (!result) {
      res.status(404).json({ error: 'API call failed' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ error: 'There was an error' });
  }
});

// route implementation GET messages/:id/:id
webapp.get('/messages/:id1/:id2', async (req, res) => {
  if (!req.params.id1 || !req.params.id2) {
    res.status(404).json({ error: 'Missing an ID(s)' });
  }
  try {
    const result = await messageDB.getChatHistory(req.params.id1, req.params.id2);
    if (!result) {
      res.status(404).json({ error: 'API call failed' });
      return;
    }
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(400).json({ error: 'There was an error' });
  }
});

// route implementation GET /similar/:id
webapp.get('/similar/:id', async (req, res) => {
  try {
    const results = await productDB.getSimilarProducts(req.params.id);
    if (!results) {
      res.status(404).json({ error: 'API call failed' });
      return;
    }
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation GET /latestProducts
webapp.get('/latestProducts', async (req, res) => {
  try {
    const results = await productDB.getLatestProducts();
    if (!results) {
      res.status(404).json({ error: 'API call failed' });
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ error: 'No latest products found' });
      return;
    }
    res.status(200).json({ data: results });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation PUT /forgot_password/:id
webapp.put('/forgot_password/:id', async (req, res) => {
  if (!req.params.id || !req.body.password) {
    res.status(404).json({ message: 'missing id or new info' });
    return;
  }
  try {
    const result = await userDB.updatePassword(req.params.id, req.body.password);
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// route implementation GET pennId from app token
webapp.get('/decode/:token', (req, res) => {
  try {
    const pennId = getPennIdFromToken(req.params.token);
    if (!pennId) {
      res.status(404).json({ error: 'unknown user' });
      return;
    }
    res.status(200).json({ data: pennId });
  } catch (err) {
    res.status(400).json({ message: 'There was an error' });
  }
});

// export the webapp
module.exports = webapp;
