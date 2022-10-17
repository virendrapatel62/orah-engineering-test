import React, { Reducer, ReducerAction, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { addIfNotExist } from "shared/helpers/local-storage"
import { LoadState, useApi } from "shared/hooks/use-api"
import { Person, PersonHelper } from "shared/models/person"
import { RollInput, RolllStateType } from "shared/models/roll"
import { ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { ToolbarAction, ToolbarActionValue } from "staff-app/daily-care/home-board.page"
import { ACTIONS, changeRollState, setStudents, setStudentsQuery } from "./actions"
import { defaultReducerValue, dailyCareReducer } from "./reducer"
import { DailyCareContextValueType, SortBy, SortedOrder } from "./types"

const defaultContextValue: DailyCareContextValueType = {
  students: [],
  isRollMode: false,
  searchQuery: "",
  onToolbarAction: () => {},
  onSearchQueryChange: (value) => {},
  sortBy: "first_name",
  sortedOrder: "asc",
  loadState: "loading",
  onActiveRollAction: (action) => {},
  onRollChange: () => {},
  rollStatus: {
    count: {},
  },
  onFilterByState: () => {},
  onCompleteRoll: () => {},
}

export const DailyCareContext: React.Context<DailyCareContextValueType> = React.createContext(defaultContextValue)

export const DailyCareContextProvider: React.FC = ({ children }) => {
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [saveRoll, saveRollData, saveRollLoadState] = useApi<{ success: boolean }>({
    url: "save-roll",
  })
  const [isRollMode, setIsRollMode] = useState(false)
  const [state, dispatch] = useReducer(dailyCareReducer, defaultReducerValue)
  const { rollInfo, students: studentsData } = state
  const { data: students, searchQuery, sortBy, sortOrder } = studentsData

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  useEffect(() => {
    dispatch(
      setStudents({
        students: data?.students || [],
      })
    )
  }, [data])

  const onSearchQueryChange = useCallback((value: string) => {
    dispatch(
      setStudentsQuery({
        studentQuery: {
          searchQuery: value?.trim(),
        },
      })
    )
  }, [])

  const onRollChange = (student: Person, newState: RolllStateType) => {
    dispatch(
      changeRollState({
        state: newState,
        student,
      })
    )
  }

  const onToolbarAction = (action: ToolbarAction, value?: ToolbarActionValue) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if (action === "sort") {
      dispatch(
        setStudentsQuery({
          studentQuery: {
            sortOrder: value?.sortOrder || sortOrder || "asc",
            sortBy: value?.sortBy || sortBy || "first_name",
          },
        })
      )
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  const setFilter = (value: RolllStateType | "all") => {
    dispatch(
      setStudentsQuery({
        studentQuery: {
          rollState: value,
        },
      })
    )
  }

  useEffect(() => {
    if(saveRollData)
    setIsRollMode(!!!saveRollData?.success)
  }, [saveRollData])

  const onCompleteRoll = () => {
    const rollInput: RollInput = {
      student_roll_states: students.map((student) => {
        return {
          roll_state: student.rollState || "unmark",
          student_id: student.id,
        }
      }),
    }
    saveRoll(rollInput)
  }


  const value: DailyCareContextValueType = {
    students: students || [],
    isRollMode,
    searchQuery,
    onSearchQueryChange,
    sortBy,
    sortedOrder: sortOrder,
    onToolbarAction,
    loadState,
    onActiveRollAction,
    onRollChange,
    rollStatus: rollInfo,
    onFilterByState: setFilter,
    onCompleteRoll,
  }


  return <DailyCareContext.Provider value={value}>{children}</DailyCareContext.Provider>
}

export const useDailyCareContext = () => {
  return useContext(DailyCareContext)
}
