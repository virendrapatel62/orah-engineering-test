import React, { useEffect, useState } from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList, StateList } from "staff-app/components/roll-state/roll-state-list.component"
import { useDailyCareContext } from "staff-app/contexts/daily-care-context"
import { RolllStateType } from "shared/models/roll"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  isActive: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick } = props
  const { students, rollStatus, onFilterByState, onCompleteRoll } = useDailyCareContext()
  const [stateList, setStateList] = useState<StateList[]>([])

  useEffect(() => {
    const list: StateList[] = []
    const states: RolllStateType[] = ["all", "absent", "late", "present"]
    states.forEach((state) => {
      list.push({ type: state, count: getCount(state) })
    })

    setStateList(list)
  }, [students, rollStatus])

  const getCount = (state: RolllStateType) => {
    return rollStatus.count[state] || 0
  }

  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList stateList={stateList} onItemClick={onFilterByState} />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button color="inherit" style={{ marginLeft: Spacing.u2 }} onClick={onCompleteRoll}>
              Complete
            </Button>
          </div>
        </div>
      </S.Content>
    </S.Overlay>
  )
}

const S = {
  Overlay: styled.div<{ isActive: boolean }>`
    position: fixed;
    bottom: 0;
    left: 0;
    height: ${({ isActive }) => (isActive ? "120px" : 0)};
    width: 100%;
    background-color: rgba(34, 43, 74, 0.92);
    backdrop-filter: blur(2px);
    color: #fff;
  `,
  Content: styled.div`
    display: flex;
    justify-content: space-between;
    width: 52%;
    height: 100px;
    margin: ${Spacing.u3} auto 0;
    border: 1px solid #f5f5f536;
    border-radius: ${BorderRadius.default};
    padding: ${Spacing.u4};
  `,
}
