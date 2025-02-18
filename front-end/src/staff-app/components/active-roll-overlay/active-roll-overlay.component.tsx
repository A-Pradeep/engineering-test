import React from "react"
import styled from "styled-components"
import Button from "@material-ui/core/Button"
import { BorderRadius, Spacing } from "shared/styles/styles"
import { RollStateList } from "staff-app/components/roll-state/roll-state-list.component"
import { studentData } from "staff-app/daily-care/home-board.page"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export type ActiveRollAction = "filter" | "exit"
interface Props {
  studentsData: studentData
  totalStudentsCount: number
  isActive: boolean
  loadState: boolean
  onItemClick: (action: ActiveRollAction, value?: string) => void
  handleSortRoll: Function
}

export const ActiveRollOverlay: React.FC<Props> = (props) => {
  const { isActive, onItemClick, studentsData, totalStudentsCount, loadState, handleSortRoll } = props
  return (
    <S.Overlay isActive={isActive}>
      <S.Content>
        <div>Class Attendance</div>
        <div>
          <RollStateList
            stateList={[
              { type: "all", count: totalStudentsCount },
              { type: "present", count: studentsData.present },
              { type: "late", count: studentsData.late },
              { type: "absent", count: studentsData.absent },
            ]}
            sortRollType={handleSortRoll}
          />
          <div style={{ marginTop: Spacing.u6 }}>
            <Button color="inherit" onClick={() => onItemClick("exit")}>
              Exit
            </Button>
            <Button
              color="inherit"
              style={{ marginLeft: Spacing.u2, color: totalStudentsCount === 0 ? "slategray" : "white" }}
              onClick={() => onItemClick("filter")}
              disabled={totalStudentsCount === 0 ? true : false}
            >
              {loadState ? <FontAwesomeIcon icon="spinner" size="2x" spin /> : "Complete"}
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
