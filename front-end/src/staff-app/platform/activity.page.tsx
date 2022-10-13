import React, { useEffect, useMemo, useState } from "react"
import styled from "styled-components"
import { FontWeight, Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Colors } from "shared/styles/colors"
import { Activity } from "shared/models/activity"
import { RollInput } from "shared/models/roll"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import { Person } from "shared/models/person"

type SidebarProps = {
  activities: Activity[]
  onClick: (id: number) => void
  selectedActiviyId: number
}

export const Sidebar: React.FC<SidebarProps> = ({ activities, onClick, selectedActiviyId }) => {
  return (
    <S.Sidebar>
      <S.SidebarItems>
        {activities.map((activity) => {
          return (
            <SidebarItem to="/" onClick={() => onClick(activity.entity.id)} isActive={activity.entity.id === selectedActiviyId}>
              {activity.entity.name}
            </SidebarItem>
          )
        })}
      </S.SidebarItems>
    </S.Sidebar>
  )
}

const SidebarItem: React.FC<any> = ({ children, ...other }) => {
  const activeStyle = ({ isActive }: { isActive: boolean }) => ({
    textDecoration: "none",
    fontWeight: FontWeight.strong,
    color: "#fff",
    padding: "18px 20px 17px",
    cursor: "pointer",
    backgroundColor: isActive ? "#1b4f90" : Colors.blue.base,
  })
  return (
    <a
      style={activeStyle({
        isActive: other.isActive,
      })}
      {...other}
    >
      {children}
    </a>
  )
}

export const ActivityPage: React.FC = () => {
  const [getActivities, data, loadingState] = useApi<{ activity: Activity[] }>({
    url: "get-activities",
  })
  const [getStudents, studentsData] = useApi<{ students: Person[] }>({
    url: "get-homeboard-students",
  })

  const [selectedActivity, setSelectedActivity] = useState<Activity>()

  const IDstudentMap = useMemo(() => {
    const record: Record<number, Person> = {}
    return studentsData?.students.reduce((acc: Record<number, Person>, student: Person) => {
      acc[student.id] = student
      return acc
    }, record)
  }, [studentsData])

  useEffect(() => {
    getActivities()
  }, [getActivities])

  useEffect(() => {
    setSelectedActivity(data?.activity[0])
  }, [data])

  useEffect(() => {
    getStudents()
  }, [getStudents])

  const onSideBarItemClick = (entityId: number) => {
    setSelectedActivity(
      data?.activity.find((entity) => {
        return entity.entity.id == entityId
      })
    )
  }
  return (
    <S.Container>
      <Sidebar activities={data?.activity || []} selectedActiviyId={selectedActivity?.entity.id} onClick={onSideBarItemClick}></Sidebar>
      <S.Content>
        {selectedActivity?.entity.student_roll_states.map((state) => {
          return <StudentListTile readOnlyRollInput={true} initialRollState={state.roll_state} isRollMode={true} student={IDstudentMap?.[state.student_id] || ({} as Person)} />
        })}
      </S.Content>
    </S.Container>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: row;
    width: 90%;
    margin: ${Spacing.u1} auto 0;
  `,

  Content: styled.section`
    padding: 10px;
    flex-grow: 1;
  `,

  Sidebar: styled.header`
    display: flex;
    flex-grow: 0;
    flex-direction: column;
    min-height: 90vh;
    width: 20%;
    background-color: ${Colors.blue.base};
    color: #fff;
  `,
  SidebarItems: styled.nav`
    display: flex;
    flex-direction: column;
    height: 100%;
  `,
}
