import { createSlice } from "@reduxjs/toolkit";

interface DataState {
  cardList: Array<any>;
}

const initialState: DataState = {
  cardList: localStorage.getItem('cardList') ? JSON.parse(localStorage.getItem('cardList') || '') : []
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setCardList: (state, action) => {
      state.cardList = action.payload.cardList;
      localStorage.setItem('cardList', JSON.stringify(action.payload.cardList));
    },
    addCard: (state, action) => {
      state.cardList = [
        ...state.cardList,
        action.payload.card
      ];
      localStorage.setItem('cardList', JSON.stringify(state.cardList));
    },
  },
});

export const { setCardList, addCard } = dataSlice.actions;
export const selectData = (state: { data: DataState }) => state.data;
export default dataSlice.reducer;
