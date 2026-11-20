import { createAsyncThunk, createSlice, type Dispatch } from "@reduxjs/toolkit";
import type { Profile } from "../../app/models/user";
import agent, { authToken, storeToken } from "../../app/api/agent";

export const fetchCurrentUser = createAsyncThunk("account/restore", async () =>
  authToken() ? agent.Account.profile() : null);

export const accountSlice = createSlice({
  name: "account",
  initialState: { user: null as Profile | null },
  reducers: {
    setProfile: (state, { payload }: { payload: Profile | null }) => { state.user = payload; },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCurrentUser.fulfilled, (state, { payload }) => { state.user = payload; });
  },
});

export const { setProfile } = accountSlice.actions;
export const logOut = () => (dispatch: Dispatch) => {
  storeToken(null);
  dispatch(setProfile(null));
};
