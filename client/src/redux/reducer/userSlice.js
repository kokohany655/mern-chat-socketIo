import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  name: "",
  email: "",
  pic: "",
  token: "",
  onlineUser: [],
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { _id, name, email, pic } = action.payload;
      state._id = _id;
      state.name = name;
      state.email = email;
      state.pic = pic;
    },
    logout: (state) => {
      state._id = "";
      state.name = "";
      state.email = "";
      state.pic = "";
      state.token = "";
      state.socketConnection = null;
    },
    setOnlineUser: (state, action) => {
      state.onlineUser = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setUser, logout, setOnlineUser } = userSlice.actions;

export default userSlice.reducer;
