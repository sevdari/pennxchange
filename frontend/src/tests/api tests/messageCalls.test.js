import axios from "axios";
import MockAdapter from 'axios-mock-adapter';
import { getAllMessages, addMessage } from "../../api/message";

const mockAxios = new MockAdapter(axios);

describe('the getAllMessages api returns the correct data for messages', () => {
  mockAxios.onGet().reply(200, [
    {
      id: 1,
      sender: 1,
      receiver: 2,
      time: "2023-02-27T12:23:00Z",
      content: "Is this product available?"
    },
    {
      id: 1,
      sender: 2,
      receiver: 1,
      time: "2023-02-27T12:35:00Z",
      content: "Yes, it is!"
    }
  ]);

  test('the content is "Is this product available"', async () => {
    const data = await getAllMessages();
    expect(data.data[0].content).toBe("Is this product available?");
  });
})

describe('get addMessage api add new messages', () => {
  mockAxios.onPost().reply(201,{
    id: 1,
    sender: 2,
    receiver: 1,
    time: "2023-02-27T12:35:00Z",
    content: "Yes, it is!"
  });

  test('message is addedd successfully', async () => {
    const response = await addMessage();
    expect(response.status).toBe(201);
    expect(response.data.content).toBe("Yes, it is!");
  });
})

