import { createSlice, PayloadAction } from "@reduxjs/toolkit";



type LabelState = {
  id: string;
  name: string;
  color: number;
};

type Labels = {
  labels: LabelState[];
  isLoading: boolean;
  error?: string;
};

const initialState: Labels = {
  labels: [],
  isLoading: false,
  error: undefined,
};

const labelsSlice = createSlice({
  name: "labels",
  initialState,
  reducers: {
    getLabels: (state) => {
        state.error = undefined;
        state.isLoading = true;
    },
    getLabelsSuccess: (state, action: PayloadAction<LabelState[]>) => {
        state.labels = action.payload;
        state.isLoading = false;
        state.error = undefined;
    },
    getLabelsFailure: (state, action: PayloadAction<string> ) => {
        state.error = action.payload;
        state.isLoading
    }
  },
});

export const { getLabels, getLabelsSuccess, getLabelsFailure } =
  labelsSlice.actions;
export default labelsSlice.reducer;
