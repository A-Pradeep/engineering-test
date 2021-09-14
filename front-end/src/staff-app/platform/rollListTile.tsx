import React, { useState } from "react"
import { Activity } from "shared/models/activity"
import { Spacing } from "shared/styles/styles"
import styled from "styled-components"

interface Props {
  rollActivity: Activity
  onClick: Function
}

export const RollListTile: React.FC<Props> = ({ rollActivity, onClick }) => {
  const [borderCurve, setBorderCurve] = useState<boolean>(false)

  const convertRawDate = (data: Date) => {
    return new Intl.DateTimeFormat("en-GB", {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      hour12: true,
      minute: "2-digit",
    }).format(new Date(rollActivity.date))
  }

  return (
    <S.Container
      border={borderCurve}
      onMouseEnter={() => setBorderCurve(true)}
      onMouseLeave={() => setBorderCurve(false)}
      onClick={() => onClick(rollActivity.entity.student_roll_states)}
    >
      {/* Top section */}
      <S.TopSection>
        <S.SpanCount>{rollActivity.entity.id}</S.SpanCount>
        <S.SpanDate> {convertRawDate(rollActivity.date)} </S.SpanDate>
      </S.TopSection>
      {/* Bottom Section */}
      <div style={{ textAlign: "center" }}>
        <h3>{rollActivity.entity.name}</h3>
      </div>
      {/* Footer section */}
      <div>
        Type :<span style={{ textTransform: "capitalize" }}> {rollActivity.type}</span>
      </div>
    </S.Container>
  )
}
const S = {
  BottomDiv: styled.div``,
  TopSection: styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
  SpanCount: styled.span`
    background-color: rgb(166, 43, 50);
    color: white;
    padding: 5px 10px;
    border-radius: 25px;
  `,
  SpanDate: styled.span`
    border: 1px solid rgb(166, 43, 50);
    border-radius: 25px;
    place-items: center;
    padding: 5px 10px;
  `,
  Container: styled.div<{ border: boolean }>`
    margin-top: ${Spacing.u3};
    border-radius: ${({ border }) => (border ? "25px" : "0px")};
    border-bottom: ${({ border }) => (border ? "1px  solid #a62b32" : "none")};
    background-color: #fff;
    box-shadow: 0 2px 7px rgba(5, 66, 145, 0.13);
    transition: box-shadow 0.2s ease-in-out;
    cursor: pointer;
    transition: 0.3s ease-in-out;
    padding: 1rem;

    &:hover {
      box-shadow: 0 2px 7px rgba(5, 66, 145, 0.26);
    }
  `,
}
