import { ActionType, DailyCareReducerStateType, PayloadType } from "./types"

const namespace = "@staff-app/context/reducer/"
export const ACTIONS = {
  CHANGE_ROLL_STATE: `${namespace}CHANGE_ROLL_STATE`,
  SET_STUDENTS: `${namespace}SET_STUDENTS`,
  SET_STUDENTS_QUERY: `${namespace}SET_STUDENTS_QUERY`,
  SORT_STUDENTS: `${namespace}SORT_STUDENTS`,
  FILTER_STUDENTS: `${namespace}FILTER_STUDENTS`,
  SET_ROLL_STATE_FILTER: `${namespace}SET_ROLL_STATE_FILTER`,
}

type Action = (payload: PayloadType) => ActionType

export const changeRollState: Action = (payload) => {
  return {
    type: ACTIONS.CHANGE_ROLL_STATE,
    payload,
  }
}

export const setStudents: Action = (payload) => {
  return {
    type: ACTIONS.SET_STUDENTS,
    payload,
  }
}

export const setStudentsQuery: Action = (payload) => {
  return {
    type: ACTIONS.SET_STUDENTS_QUERY,
    payload,
  }
}

export const setRollStateFilter: Action = (payload) => {
  return {
    type: ACTIONS.SET_ROLL_STATE_FILTER,
    payload,
  }
}
