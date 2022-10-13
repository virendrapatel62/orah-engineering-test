import React from "react"
import { Person, PersonHelper } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"
import { ACTIONS } from "./actions"
import { ActionType, DailyCareReducerStateType, SortBy, SortedOrder } from "./types"

type DailyCareReducerType = React.Reducer<DailyCareReducerStateType, ActionType>

const PRESENT: RolllStateType = "present"
const ABSENT: RolllStateType = "absent"
const LATE: RolllStateType = "late"
const UNMARK: RolllStateType = "unmark"

export const defaultReducerValue: DailyCareReducerStateType = {
  rollInfo: {
    count: {
      [ABSENT]: 0,
      [PRESENT]: 0,
      [UNMARK]: 0,
      [LATE]: 0,
    },
  },
  students: {
    rawStudents: [],
    data: [],
    searchQuery: "",
    sortBy: "first_name",
    sortOrder: "asc",
    rollState: "all",
  },
}

export const dailyCareReducer: DailyCareReducerType = (currentState, action) => {
  switch (action.type) {
    case ACTIONS.CHANGE_ROLL_STATE:
      return changeRollState(currentState, action)
    case ACTIONS.SET_STUDENTS:
      return setStudents(currentState, action)
    case ACTIONS.SET_STUDENTS_QUERY:
      return setStudentsQuery(currentState, action)
  }

  return currentState
}

const setStudents: DailyCareReducerType = (currentState, action) => {
  const { students } = action.payload

  return {
    ...currentState,
    students: {
      ...currentState.students,
      data: students || [],
      rawStudents: students || [],
    },
  }
}

const sortStudents = (students: Person[], sortOrder: SortedOrder, sortBy: SortBy) => {
  students.sort((student1, student2) => {
    const value1 = student1[sortBy]
    const value2 = student2[sortBy]

    if (value1 < value2) {
      return sortOrder === "asc" ? -1 : 1
    }
    if (value1 > value2) {
      return sortOrder === "asc" ? 1 : -1
    }
    return 0
  })
}

const filterStudentsByname = (students: Person[], searchQuery: string) => {
  if (!!searchQuery.trim()) {
    return students.filter((student) => {
      return PersonHelper.getFullName(student).toLowerCase().includes(searchQuery?.toLowerCase())
    })
  }

  return students
}

const getStudentsByRollState = (currentState: DailyCareReducerStateType, rollState: RolllStateType | "all") => {
  if (rollState == "all") return currentState.students.rawStudents

  return currentState.students.rawStudents.filter((student) => {
    return student.rollState === rollState
  })
}

const setStudentsQuery: DailyCareReducerType = (currentState, action) => {
  const { studentQuery } = action.payload
  let { searchQuery, sortBy, sortOrder, rollState } = studentQuery || {}

  if (searchQuery == undefined) {
    searchQuery = currentState.students.searchQuery || ""
  }
  sortBy = sortBy || currentState.students.sortBy || "first_name"
  sortOrder = sortOrder || currentState.students.sortOrder || "asc"
  rollState = rollState || currentState.students.rollState || "all"

  let students: Person[] = []

  students = [...(getStudentsByRollState(currentState, rollState) as Person[])]

  const { sortBy: currentSortBy, sortOrder: currentSortOrder } = currentState.students

  if (searchQuery && searchQuery.trim()) {
    students = filterStudentsByname(students, searchQuery)
  }
  if ((sortBy || sortOrder) && (sortBy !== currentSortBy || sortOrder !== currentSortOrder)) {
    sortStudents(students, sortOrder || "asc", sortBy || "first_name")
  }

  const rollStateCount = { ...currentState.rollInfo.count }
  rollStateCount["all"] = currentState.students.rawStudents.length || 0
  return {
    ...currentState,
    rollInfo: {
      ...currentState.rollInfo,
      count: {
        ...rollStateCount,
      },
    },
    students: {
      ...currentState.students,
      data: students,
      searchQuery,
      sortBy,
      sortOrder,
    },
  }
}

const changeRollState: DailyCareReducerType = (currentState, action) => {
  const { state: newRollState, student } = action.payload

  if (!newRollState) {
    throw new Error("state is required.")
  }

  const students = [...currentState.students.rawStudents]
  const rollInfoCount = {
    ...currentState.rollInfo.count,
  }

  const studentIndex = students.findIndex((s) => s.id === student?.id)
  const currentStudent = students[studentIndex]

  const prevRollState = currentStudent?.rollState || "unmark"
  const prevRollStateCount = rollInfoCount[prevRollState]
  const newRollStateCount = rollInfoCount[newRollState]
  currentStudent.rollState = newRollState

  if (prevRollStateCount) {
    rollInfoCount[prevRollState] -= 1
  }

  if (newRollStateCount) {
    rollInfoCount[newRollState] += 1
  } else {
    rollInfoCount[newRollState] += 1
  }

  return {
    ...currentState,
    students: {
      ...currentState.students,
      rawStudents: students,
    },
    rollInfo: {
      count: {
        ...rollInfoCount,
      },
    },
  }
}
