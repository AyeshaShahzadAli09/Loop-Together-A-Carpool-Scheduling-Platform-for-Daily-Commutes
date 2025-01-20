import { createSlice } from '@reduxjs/toolkit';

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: {
      user1_user2: [],
    },
  },
  reducers: {
    addMessage: (state, action) => {
      const { chatId, sender, message, timestamp } = action.payload;
      if (!state.chats[chatId]) state.chats[chatId] = [];
      state.chats[chatId].push({ sender, message, timestamp });
    },
  },
});

export const { addMessage } = chatSlice.actions;
export default chatSlice.reducer;
