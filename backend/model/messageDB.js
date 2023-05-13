const mainDB = require('./mainDB');

/**
 * gets all messages in the database
 */
const getMessages = async () => {
  try {
    const db = await mainDB.getDB();
    const messages = await db.collection('Messages').find({}).toArray();
    return messages;
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * gets all messages for a user
 */
const getMessagesId = async (pennId) => {
  try {
    const db = await mainDB.getDB();
    const messages = await db.collection('Messages')
      .find({ $or: [{ sender: parseInt(pennId, 10) }, { receiver: parseInt(pennId, 10) }] })
      .toArray();
    return messages;
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * post a message
 */
const addMessage = async (message) => {
  try {
    const db = await mainDB.getDB();
    const result = await db.collection('Messages').insertOne(message);
    return result.insertedId;
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * get all the people that a person has chat history with
 * array concatenation and removing duplicates: https://stackoverflow.com/questions/1584370/how-to-merge-two-arrays-in-javascript-and-de-duplicate-items
 * array includes: https://www.w3schools.com/jsref/jsref_includes_array.asp
 * */
const getContacts = async (pennId) => {
  // get all messages for a certain user using getMessagesId
  try {
    const db = await mainDB.getDB();
    // console.log(db);
    const senderQuery = { sender: parseInt(pennId, 10) };
    const receiverQuery = { receiver: parseInt(pennId, 10) };
    const senderOptions = { projection: { sender: 1, _id: 0 }, sort: { time: -1 } };
    const receiverOptions = { projection: { receiver: 1, _id: 0 }, sort: { time: -1 } };
    // const senders = await db.collection('Messages').find(senderQuery, senderOptions).toArray();
    const senders = await db.collection('Messages').find(receiverQuery, senderOptions).toArray();
    // console.log('SENDERS: ', senders);
    const receivers = await db.collection('Messages').find(senderQuery, receiverOptions).toArray();
    // console.log('RECEIVERS: ', receivers);
    const contacts = [];
    senders.forEach((element) => {
      if (!contacts.includes(element.sender)) {
        contacts.push(element.sender);
      }
    });
    receivers.forEach((element) => {
      if (!contacts.includes(element.receiver)) {
        contacts.push(element.receiver);
      }
    });
    return contacts;
  } catch (err) {
    console.log(err);
  }
  return null;
};

/**
 * get the chat history between two people
 * https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
 * for array.sort() https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 */
const getChatHistory = async (pennId1, pennId2) => {
  // only retrieve messages from mongo where these two ides are sender/receiver
  const db = await mainDB.getDB();
  let messages = [];
  const m1 = await db.collection('Messages').find({ $and: [{ sender: parseInt(pennId1, 10) }, { receiver: parseInt(pennId2, 10) }] }, { sort: { time: -1 } }).toArray();
  const m2 = await db.collection('Messages').find({ $and: [{ receiver: parseInt(pennId1, 10) }, { sender: parseInt(pennId2, 10) }] }, { sort: { time: -1 } }).toArray();
  messages = m1.concat(m2);
  function compare(a, b) {
    // from stack overflow: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    if (a.time < b.time) {
      return -1;
    }
    if (a.time > b.time) {
      return 1;
    }
    return 0;
  }
  messages.sort(compare); // from stack overflow and cited above
  return messages;
};

// const main = async () => {
//   let messages = await getMessages();
//   // console.log(messages);
//   messages = await getMessagesId(12312312);
//   console.log(messages);
//   const message = {
//     sender: 23423423,
//     receiever: 45645645,
//     time: '2023-04-30T05:00:00Z',
//     content: 'Thank you!',
//   };
//   const id = await addMessage(message);
//   console.log(id);
//   messages = await getMessages();
//   console.log(messages);
// };
// main();

module.exports = {
  getMessages,
  getMessagesId,
  addMessage,
  getContacts,
  getChatHistory,
};
