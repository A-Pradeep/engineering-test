import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"
import { Person } from "shared/models/person"
import { Spacing } from "shared/styles/styles"
import { StudentListTile } from "staff-app/components/student-list-tile/student-list-tile.component"
import styled from "styled-components"

interface Props {
  studentsAttendance: Person[]
  activateSlider: boolean
  resetRollChoice: Function
}

export const DetailsSlider: React.FC<Props> = ({ studentsAttendance, activateSlider, resetRollChoice }) => {
  return (
    <>
      {/* Slider Background */}
      <S.SliderParent slider={activateSlider}>
        {/* render div */}
        <S.SliderChild>
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <span>
              <h1>Student Attendance Details </h1>
            </span>
            <span onClick={() => resetRollChoice()}>
              <FontAwesomeIcon icon="times-circle" size="2x" style={{ cursor: "pointer" }} />
            </span>
          </div>
          <hr />
          <S.PageContainer>
            {studentsAttendance.map((student, index) => (
              <StudentListTile key={index} onAttendanceChange={() => void 0} isRollMode={false} student={student} isViewMode={true} />
            ))}
          </S.PageContainer>
        </S.SliderChild>
      </S.SliderParent>
    </>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
    pointer-events: none;
  `,
  SliderParent: styled.div<{ slider: boolean }>`
    display: ${({ slider }) => (slider ? "auto" : "none")};
    background: rgba(51, 51, 51, 0.7);
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0px;
    top: 0px;
    z-index: 1;
  `,
  SliderChild: styled.div`
    width: calc(100% - 40%);
    z-index: 2;
    height: 100%;
    right: 0px;
    top: 0px;
    position: absolute;
    background: white;
    border-top-left-radius: 15px;
    padding: 1rem;
    overflow: auto;
  `,
}
