import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { CenteredContainer } from "shared/components/centered-container/centered-container.component"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { RollListTile } from "./rollListTile"
import { Activity } from "shared/models/activity"
import { Person } from "shared/models/person"
import { DetailsSlider } from "./detailsSlider"

export const ActivityPage: React.FC = () => {
  const [getActivity, data, loadState] = useApi<{ activity: Activity[] }>({ url: "get-activities" })
  const [activateSlider, setActivateSlider] = useState<boolean>(false)
  const [selectedStudentAttendance, setSelectedStudentAttendance] = useState<Person[] | undefined>()

  const handleRollChoice = (rollChoice: Person[]) => {
    setSelectedStudentAttendance(rollChoice)
    setActivateSlider(true)
  }
  const resetRollChoice = () => {
    setSelectedStudentAttendance(undefined)
    setActivateSlider(false)
  }

  useEffect(() => {
    getActivity()
  }, [getActivity])

  return (
    <S.PageContainer>
      <h1>Activity Page</h1>

      {loadState === "loading" && (
        <CenteredContainer>
          Fetching activities <br />
          <FontAwesomeIcon icon="spinner" size="2x" spin />
        </CenteredContainer>
      )}

      {loadState === "loaded" && data?.activity.length === 0 && (
        <S.PageContainer style={{ textAlign: "center" }}>
          <h2>No activity saved.</h2>
        </S.PageContainer>
      )}
      {loadState === "loaded" && data?.activity.length !== undefined && (
        <>
          {data.activity
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((rollData, index) => (
              <RollListTile key={index} rollActivity={rollData} onClick={handleRollChoice} />
            ))}
        </>
      )}

      {loadState === "error" && (
        <CenteredContainer>
          <div>Failed to load</div>
        </CenteredContainer>
      )}

      {loadState === "loaded" && selectedStudentAttendance && (
        <>
          <DetailsSlider studentsAttendance={selectedStudentAttendance} resetRollChoice={resetRollChoice} activateSlider={activateSlider} />
        </>
      )}
    </S.PageContainer>
  )
}

const S = {
  PageContainer: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
}
