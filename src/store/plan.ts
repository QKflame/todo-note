import {createSelector, createSlice} from '@reduxjs/toolkit';

interface PlanState {
  // 当前选中的计划ID
  currentPlanId: string;
  // 计划列表
  plans: Array<{
    id: number;
    title: string;
  }>;
}

const initialState: PlanState = {
  currentPlanId: localStorage.getItem('CURRENT_PLAN_ID') || 'recent',
  plans: []
};

const planSlice = createSlice({
  name: 'plan',
  initialState,
  reducers: {
    setCurrentPlanId(state, {payload}) {
      localStorage.setItem('CURRENT_PLAN_ID', payload.planId);
      state.currentPlanId = payload.planId;
    },
    setPlans(state, {payload}) {
      state.plans = payload.plans;
    }
  }
});

const plan = (state) => state.plan;

const isTrashSelector = createSelector(
  plan,
  (_) => _.currentPlanId.toString() === '-2'
);

export const {setCurrentPlanId, setPlans} = planSlice.actions;
export {isTrashSelector};
export default planSlice.reducer;
