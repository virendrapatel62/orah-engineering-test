import { LoadState } from "shared/hooks/use-api"
import { Person } from "shared/models/person"
import { RolllStateType } from "shared/models/roll"
import { ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"
import { ToolbarAction, ToolbarActionValue } from "staff-app/daily-care/home-board.page"

export type PayloadType = {
  state?: RolllStateType
  student?: Person
  students?: Person[]
  studentQuery?: {
    sortBy?: SortBy
    sortOrder?: SortedOrder
    searchQuery?: string
    rollState?: RolllStateType | "all"
  }
}

export type ActionType = {
  type: string
  payload: PayloadType
}
type SetState<T> = React.Dispatch<React.SetStateAction<T>>

export type DailyCareContextValueType = {
  students: Person[]
  isRollMode: boolean
  onToolbarAction: (action: ToolbarAction, value?: ToolbarActionValue) => void
  sortedOrder: SortedOrder
  sortBy: SortBy
  searchQuery: string
  onSearchQueryChange: (value: string) => void
  loadState: LoadState
  onActiveRollAction: (action: ActiveRollAction) => void
  onRollChange: (student: Person, rollState: RolllStateType) => void
  rollStatus: RollInfo
  onFilterByState: (type: RolllStateType | "all") => void
  onCompleteRoll: () => void
}

export type RollInfo = {
  count: {
    [index: string]: number
  }
}

export type DailyCareReducerStateType = {
  rollInfo: RollInfo
  students: {
    rawStudents: Person[]
    data: Person[]
    sortBy: SortBy
    sortOrder: SortedOrder
    searchQuery: string
    rollState: RolllStateType | "all"
  }
}

export type SortedOrder = "asc" | "desc" | null
export type SortBy = "first_name" | "last_name"
