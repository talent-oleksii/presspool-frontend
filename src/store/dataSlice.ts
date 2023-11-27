import { createSlice } from "@reduxjs/toolkit";

interface DataState {
  campaign: Array<any>;
  cardList: Array<any>;
}

const initialState: DataState = {
  campaign: localStorage.getItem('campaign') ? JSON.parse(localStorage.getItem('campaign') || '') : [],
  cardList: localStorage.getItem('cardList') ? JSON.parse(localStorage.getItem('cardList') || '') : []
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setCampaign: (state, action) => {
      state.campaign = action.payload.campaign;
      localStorage.setItem('campaign', JSON.stringify(action.payload.campaign));
    },
    addCampaign: (state, action) => {
      console.log('this add called', action.payload);
      state.campaign = [
        ...state.campaign,
        action.payload.campaign
      ];
      console.log('after add:', state.campaign);
      localStorage.setItem('campaign', JSON.stringify(state.campaign));
    },
    updateCampaign: (state, action) => {
      const campaignList = [...state.campaign];

      state.campaign = campaignList.map(item => {
        if (item.id === action.payload.id) {
          return { ...item, state: action.payload.state }
        }
        return item;
      });

      localStorage.setItem('campaign', JSON.stringify(state.campaign));
    },
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

export const { setCardList, addCard, setCampaign, addCampaign, updateCampaign } = dataSlice.actions;
export const selectData = (state: { data: DataState }) => state.data;
export default dataSlice.reducer;
