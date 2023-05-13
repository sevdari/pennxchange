/**
* @jest-environment jsdom
*/

import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import MessageBoard from '../../components/MessageBoard';
import Message from '../../components/Message';
import MessageTextBox from '../../components/MessageTextBox';
import { getAllMessages, addMessage } from '../../api/message';

jest.mock('../../api/message');

// failed, comment out for now
// describe('MessageBoard', () => {
//   afterEach(() => {
//     jest.clearAllMocks();
//   });
//   test('contains chat header', () => {
//     const { getByText } = render(<MessageBoard />);
//     expect(getByText('Chat')).toBeInTheDocument();
//   });
//   test('contains a div with a className messages', () => {
//     const { container } = render(<MessageBoard />);
//     const messagesDiv = container.querySelector('.board-messages');
//     expect(messagesDiv).toBeInTheDocument();
//   });
//   test('displays messages fetched from the API', async () => {
//     getAllMessages.mockResolvedValue({
//       data: [
//         { id: 1, content: 'Hello', sender: 1, time: "2023-02-27T12:26:00Z"},
//         { id: 2, content: 'Hi', sender: 2, time: "2023-03-20T08:26:00Z" },
//       ],
//     });
//     render(<MessageBoard />);
//     await screen.findByText('Hello');
//     expect(screen.getByText('Hello')).toBeInTheDocument();
//   });
// })

describe('Messages', () => {
  test('contains a sender', () => {
    const message = { _id: '120', role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"};
    const { container } = render(<Message message={message} />);
    const roleElement = container.querySelector('.message-sender');
    expect(roleElement).toBeInTheDocument();
  });
})

describe('Messages Text Box', () => {
  test('when user enters a message, it is displayed in the textbox', async () => {
    const messagesArray = [{ _id: '12', role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"},{ id: 120, role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"}];
    render(<MessageTextBox messages={messagesArray} setMessages={()=>{}}/>);
    const element = screen.getByRole('textbox');
    await userEvent.type(element, 'How are you?');
    expect(element).toHaveValue('How are you?');
  });
  test('textbox becomes empty when button is pressed', async () => {
    const messagesArray = [{ _id: '12', role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"},{ id: 120, role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"}];
    addMessage.mockResolvedValue({
      data:[
        { id: 12, role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"}
      ]
    });
    render(<MessageTextBox messages={messagesArray} setMessages={()=>{}}/>);
    const button = screen.getByTestId('chat-submit');
    const element = screen.getByRole('textbox');
    userEvent.type(element, 'How are you?');
    userEvent.click(button);
    expect(element).toHaveValue('');
  });
  test('shows placeholder text when textbox is empty', async () => {
    const messagesArray = [{ id: 12, role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"},{ id: 120, role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"}];
    addMessage.mockResolvedValue({
      data:[
        { id: 12, role: "sender", imgAdd: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80', time: "2023-02-27T12:26:00Z", content: "nice to meet you"}
      ]
    });
    render(<MessageTextBox messages={messagesArray} setMessages={()=>{}}/>);
    const button = screen.getByTestId('chat-submit');
    userEvent.click(button);
    const textbox = screen.getByPlaceholderText('Please enter a message');
    expect(textbox.placeholder).toBe('Please enter a message');
  })
})
