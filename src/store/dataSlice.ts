import { createSlice } from "@reduxjs/toolkit";

interface DataState {
  campaign: Array<any>;
  cardList: Array<any>;
  clicked: Array<any>;
  newsletter: Array<any>;
  isCampaignLoading: boolean;
  selectedDateFilter: string;
  prevData: any;
}

const initialState: DataState = {
  campaign: localStorage.getItem("campaign")
    ? JSON.parse(localStorage.getItem("campaign") || "")
    : [],
  cardList: localStorage.getItem("cardList")
    ? JSON.parse(localStorage.getItem("cardList") || "")
    : [],
  clicked: localStorage.getItem("clicked")
    ? JSON.parse(localStorage.getItem("clicked") || "")
    : [],
  newsletter: [],
  isCampaignLoading: false,
  selectedDateFilter: "All Time",
  prevData: {
    totalSpend: 0,
    avgCPC: 0,
    verifiedClicks: 0,
    totalBudget: 0,
    uniqueClicks: 0,
    totalClicks: 0,
  },
};

const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    setSelectedDateFilter: (state, action) => {
      state.selectedDateFilter = action.payload;
    },
    setCampaignLoading: (state, action) => {
      state.isCampaignLoading = action.payload;
    },
    setCampaign: (state, action) => {
      state.campaign = action.payload.campaign;
      state.isCampaignLoading = false;
      localStorage.setItem("campaign", JSON.stringify(action.payload.campaign));
    },
    addCampaign: (state, action) => {
      state.campaign = [...state.campaign, action.payload.campaign];
      localStorage.setItem("campaign", JSON.stringify(state.campaign));
    },
    updateCampaign: (state, action) => {
      const campaignList = [...state.campaign];

      state.campaign = campaignList.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload.data;
        }
        return item;
      });

      localStorage.setItem("campaign", JSON.stringify(state.campaign));
    },
    setCardList: (state, action) => {
      state.cardList = action.payload.cardList;
      localStorage.setItem("cardList", JSON.stringify(action.payload.cardList));
    },
    addCard: (state, action) => {
      state.cardList = [...state.cardList, action.payload.card];
      localStorage.setItem("cardList", JSON.stringify(state.cardList));
    },
    deleteCard: (state, action) => {
      const cardList = [...state.cardList];
      state.cardList = cardList.filter((item) => item.id !== action.payload.id);
      localStorage.setItem("cardList", JSON.stringify(state.cardList));
    },
    setClicked: (state, action) => {
      state.clicked = action.payload;
      localStorage.setItem("clicked", JSON.stringify(state.clicked));
    },
    setPrevRangeData: (state, action) => {
      state.prevData = action.payload;
    },
    setNewsletter: (state, action) => {
      state.newsletter = action.payload;
    },
  },
});

export const {
  setCardList,
  addCard,
  setCampaign,
  addCampaign,
  updateCampaign,
  deleteCard,
  setClicked,
  setCampaignLoading,
  setSelectedDateFilter,
  setNewsletter,
  setPrevRangeData,
} = dataSlice.actions;
export const selectData = (state: { data: DataState }) => state.data;
export default dataSlice.reducer;
