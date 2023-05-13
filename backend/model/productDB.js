const { ObjectId } = require('mongodb');
const mainDB = require('./mainDB');
// https://www.google.com/search?q=how+to+run+a+js+file+in+vs+code&rlz=1C5CHFA_enUS971US971&oq=how+to+run+a+js+file+in+&aqs=chrome.0.0i512j69i57j0i512l8.3948j0j7&sourceid=chrome&ie=UTF-8

/**
 * searchProduct - generates the products
 */

const searchProduct = async (keyword) => {
  try {
    const db = await mainDB.getDB();
    // const allProducts = await db.collection('Products').find({}).toArray();
    // const searchResults = [];
    // allProducts.forEach((element) => {
    //   const name = element.productName;
    //   const description = element.productDescription;
    //   const { _id } = element;
    //   if (name.includes(keyword)) {
    //     searchResults.push(_id.toString());
    //   } else if (description.includes(keyword)) {
    //     searchResults.push(_id.toString());
    //   }
    // });
    // return searchResults;
    // run filter to see if field contains substring
    // const results = db.collection('Products').find({"name":{$regex: keyword}});
    // https://sparkbyexamples.com/mongodb/mongodb-check-if-a-field-contains-a-string/
    // https://stackoverflow.com/questions/8238181/mongodb-how-to-find-string-in-multiple-fields
    // make the query case insensitive
    const caseInsensitiveKeywordRegex = new RegExp(keyword, 'i');
    const results = await db.collection('Products').find({
      $or: [
        { productName: { $regex: caseInsensitiveKeywordRegex } },
        { productDescription: { $regex: caseInsensitiveKeywordRegex } },
        { productCategory: { $regex: caseInsensitiveKeywordRegex } },
      ],
    }).toArray();
    return results;
  } catch (err) {
    return null;
  }
};

/**
 * getProduct - GET product from its id
 */

const getProduct = async (productId) => {
  try {
    const db = await mainDB.getDB();
    const product = await db.collection('Products').findOne({ _id: new ObjectId(productId) });
    return product;
  } catch (err) {
    return null;
  }
};

/**
 * getPostedProducts - GET all products a user posted
 */

// const getPostedProducts = async (sellerId) => {
//   try {
//     const db = await mainDB.getDB();
//     const allProducts = await db.collection('Products').find({}).toArray();
//     const postedProducts = [];
//     allProducts.forEach((element) => {
//       if (element.productSeller === sellerId) {
//         const { _id } = element;
//         postedProducts.push(_id.toString());
//       }
//     });
//     return postedProducts;
//   } catch (err) {
//     return null;
//   }
// };

/**
 * getAllProducts - GET all products in the database
 */

const getAllProducts = async () => {
  try {
    const db = await mainDB.getDB();
    const allProducts = await db.collection('Products').find({}).toArray();
    return allProducts;
  } catch (err) {
    return null;
  }
};

/**
 * makeProduct - POST a new product to the database
 */

const makeProduct = async (makeProductObject) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Products').insertOne(makeProductObject);
    return result.insertedId;
  } catch (err) {
    return null;
  }
};

/**
 * updateProduct - PUT a product with new details to the database
 */
const updateProduct = async (productId, updateProductObject) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Products').updateOne(
      { _id: new ObjectId(productId) },
      {
        $set: {
          productName: updateProductObject.productName,
          productImage: updateProductObject.productImage,
          productDescription: updateProductObject.productDescription,
          productCategory: updateProductObject.productCategory,
          productPrice: updateProductObject.productPrice,
          productPostedDate: updateProductObject.productPostedDate,
          productCondition: updateProductObject.productCondition,
          productSeller: updateProductObject.productSeller,
        },
      },
    );
    return result;
  } catch (err) {
    return null;
  }
};

/**
 * getSimilarProducts - GET at most 3 products in the same category
 */

const getSimilarProducts = async (productId) => {
  try {
    const db = await mainDB.getDB();
    const product = await db.collection('Products').findOne({ _id: new ObjectId(productId) });
    // get all the products within the same category
    const query = {
      productCategory: product.productCategory,
      _id: { $ne: new ObjectId(productId) },
    };
    // return only the ids and dont return more than 3 items
    const options = { projection: { _id: 1 }, limit: 3 };
    const similarProducts = await db.collection('Products').find(query, options).toArray();
    return similarProducts;
  } catch (err) {
    return null;
  }
};

const getLatestProducts = async () => {
  try {
    const db = await mainDB.getDB();
    const latestProducts = await db.collection('Products').find({}).sort({ productPostedDate: -1 }).limit(3)
      .toArray();
    return latestProducts;
  } catch (err) {
    return null;
  }
};

/**
 * deleteProduct - DELETE a product from the database
 */
const deleteProduct = async (productId) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Products').deleteOne({ _id: new ObjectId(productId) });
    return result;
  } catch (err) {
    return null;
  }
};

// const main = async () => {
//   const result = await getAllProducts();
//   console.log(result);
// };
// main();

module.exports = {
  searchProduct,
  getProduct,
  getAllProducts,
  makeProduct,
  updateProduct,
  deleteProduct,
  getSimilarProducts,
  getLatestProducts,
};
