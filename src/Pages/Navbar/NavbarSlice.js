import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  show: true,
  isMobile:false
};

const NavbarSlice = createSlice({
  name: "Navbar",
  initialState,
  reducers: {
    handleShow: (state) => {
      state.show = !state.show;
    },
    handleIsMobile: (state) => {
      state.isMobile = state.isMobile;
    },
  },

});

export const {handleShow,handleIsMobile} = NavbarSlice.actions;

export default NavbarSlice.reducer;
