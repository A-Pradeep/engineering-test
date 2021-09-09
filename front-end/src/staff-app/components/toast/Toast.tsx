import React from "react"
import { toastState } from "staff-app/daily-care/home-board.page"
import styled from "styled-components"

interface Props {
  toastState: toastState
}

export const Toast: React.FC<Props> = (props) => {
  const { toastState } = props
  return (
    <>
      <toastStyle.mainDiv visible={toastState.visible}>
        <h3>{toastState.message}</h3>
      </toastStyle.mainDiv>
    </>
  )
}

const toastStyle = {
  mainDiv: styled.div<{ visible: boolean }>`
    display: ${({ visible }) => (visible ? "block" : "none")};
    position: fixed;
    bottom: 2rem;
    right: 5rem;
    border: 1px solid #a62b32;
    padding: 0px 1rem;
    border-radius: 25px;
  `,
}
