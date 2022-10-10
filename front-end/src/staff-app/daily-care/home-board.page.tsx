import React, { useState, useEffect, ChangeEventHandler } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/ButtonBase"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { Colors } from "shared/styles/colors"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { Person } from "shared/models/person"
import { useApi } from "shared/hooks/use-api"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { ActiveRollOverlay, ActiveRollAction } from "staff-app/components/active-roll-overlay/active-roll-overlay.component"

type SortedOrder = "asc" | "desc" | null
type SortBy = "first_name" | "last_name"
export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [sortedOrder, setSortedOrder] = useState<SortedOrder>("asc")
  const [sortBy, setSortBy] = useState<SortBy>("first_name")

  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [students, setStudents] = useState<Person[]>([])

  useEffect(() => {
    const sorted = [...(data?.students || [])].sort((student1, student2) => {
      const value1 = student1[sortBy]
      const value2 = student2[sortBy]

      console.log(value1, value2, sortBy, sortedOrder)
      if (value1 < value2) {
        return sortedOrder === "asc" ? -1 : 1
      }
      if (value1 > value2) {
        return sortedOrder === "asc" ? 1 : -1
      }
      return 0
    })

    setStudents(sorted)
  }, [sortedOrder, data, sortBy])

  useEffect(() => {
    void getStudents()
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction, value?: ToolbarActionValue) => {
    if (action === "roll") {
      setIsRollMode(true)
    } else if (action === "sort") {
      setSortedOrder((sortedOrder) => value?.sortOrder || sortedOrder)
      setSortBy((sortBy) => value?.sortBy || sortBy)
    }
  }

  const onActiveRollAction = (action: ActiveRollAction) => {
    if (action === "exit") {
      setIsRollMode(false)
    }
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && students && (
          <>
            {students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}
      </S.PageContainer>
      <ActiveRollOverlay isActive={isRollMode} onItemClick={onActiveRollAction} />
    </>
  )
}

type ToolbarAction = "roll" | "sort"
type ToolbarActionValue = {
  sortBy?: SortBy
  sortOrder?: SortedOrder
}
interface ToolbarProps {
  onItemClick: (action: ToolbarAction, value?: ToolbarActionValue) => void
}
interface SortedIconType {
  sortedOrder?: SortedOrder
  [index: string]: any
}

const SortIcon: React.FC<SortedIconType> = ({ sortedOrder, ...props }) => {
  const images = {
    asc: "/public/icons/sort-ascending.png",
    desc: "/public/icons/sort-descending.png",
  }

  if (sortedOrder == "desc") {
    return <S.IconImage src={images.desc} alt="" height={20} {...props} />
  }
  return <S.IconImage src={images.asc} alt="" height={20} {...props} />
}

const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick } = props
  const [sortActionValues, setSortActionValues] = useState<ToolbarActionValue>({
    sortBy: "first_name",
    sortOrder: "asc",
  })

  const onSortOrderChange = () => {
    const newSortedOrder = sortActionValues.sortOrder == "asc" ? "desc" : "asc"

    const sortValues: ToolbarActionValue = {
      ...sortActionValues,
      sortOrder: newSortedOrder,
    }
    onItemClick("sort", sortValues)
    setSortActionValues(sortValues)
  }

  const onSortByChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    const sortValues: ToolbarActionValue = {
      ...sortActionValues,
      sortBy: (value ? value : "first_name") as SortBy,
    }
    onItemClick("sort", sortValues)
    setSortActionValues(sortValues)
  }

  return (
    <S.ToolbarContainer>
      <div>
        <span>
          First name <input onChange={onSortByChange} type="radio" name="sortBy" value={"first_name"} checked={sortActionValues.sortBy == "first_name"} />
        </span>
        <span>
          Last name <input onChange={onSortByChange} type="radio" name="sortBy" value={"last_name"} checked={sortActionValues.sortBy == "last_name"} />
        </span>
      </div>

      <SortIcon sortedOrder={sortActionValues.sortOrder} onClick={onSortOrderChange} />
      <div>Search</div>
      <S.Button onClick={() => onItemClick("roll")}>Start Roll</S.Button>
    </S.ToolbarContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  ToolbarContainer: styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 6px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  Button: styled(Button)`
    && {
      padding: ${Spacing.u2};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,

  IconImage: styled.img`
    height: 20;
    cursor: pointer;
    color: "white";
  `,
}
