import React, { useState, useEffect } from "react"
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
import { IconName } from "@fortawesome/fontawesome-svg-core"
import { LocalStorageKey } from "shared/helpers/local-storage"
import { Toast } from "staff-app/components/toast/Toast"
import { RolllStateType } from "shared/models/roll"

export interface studentData {
  present: number
  absent: number
  late: number
}
export interface sortState {
  stateName: string
  sortIcon: string
}
enum sortIcon {
  initial = "sort",
  asc = "sort-alpha-down",
  desc = "sort-alpha-down-alt",
}
export interface toastState {
  message: string
  visible: boolean
}

export const currestSortRoll = React.createContext<string | null>("")

export const HomeBoardPage: React.FC = () => {
  const [isRollMode, setIsRollMode] = useState(false)
  const [getStudents, data, loadState] = useApi<{ students: Person[] }>({ url: "get-homeboard-students" })
  const [callApi] = useApi({ url: "save-roll" })
  const [studentAttendanceData, setStudentAttendanceData] = useState<studentData>({
    present: 0,
    late: 0,
    absent: 0,
  })
  const [currentSortState, setCurrentSortState] = useState<sortState>({
    stateName: "First",
    sortIcon: sortIcon.initial,
  })
  const [, setSearchStudent] = useState<string>()
  const [loadIcon, setLoadIcon] = useState(false)
  const [toastState, setToastState] = useState<toastState>({
    message: "",
    visible: false,
  })
  const [sortRollBy = "unmark", setSortRollBy] = useState<RolllStateType | null>()

  useEffect(() => {
    getStudents()
    localStorage.removeItem(LocalStorageKey.students)
  }, [getStudents])

  const onToolbarAction = (action: ToolbarAction) => {
    switch (action) {
      case "roll":
        setIsRollMode(true)
        break
      case "sortField":
        setCurrentSortState({
          sortIcon: sortIcon.initial,
          stateName: currentSortState.stateName === "First" ? "Last" : "First",
        })
        break
      case "sort":
        if (currentSortState.sortIcon === "sort") {
          let tempData =
            currentSortState.stateName === "First"
              ? data?.students.sort((a, b) => a.first_name.localeCompare(b.first_name))
              : data?.students.sort((a, b) => a.last_name.localeCompare(b.last_name))
          localStorage.setItem(LocalStorageKey.students, JSON.stringify(tempData))
          setCurrentSortState({
            ...currentSortState,
            sortIcon: sortIcon.asc,
          })
        } else if (currentSortState.sortIcon === "sort-alpha-down") {
          let tempData =
            currentSortState.stateName === "First"
              ? data?.students.sort((a, b) => b.first_name.localeCompare(a.first_name))
              : data?.students.sort((a, b) => b.last_name.localeCompare(a.last_name))
          localStorage.setItem(LocalStorageKey.students, JSON.stringify(tempData))
          setCurrentSortState({
            ...currentSortState,
            sortIcon: sortIcon.desc,
          })
        } else {
          let tempData =
            currentSortState.stateName === "First"
              ? data?.students.sort((a, b) => a.first_name.localeCompare(b.first_name))
              : data?.students.sort((a, b) => a.last_name.localeCompare(b.last_name))
          localStorage.setItem(LocalStorageKey.students, JSON.stringify(tempData))
          setCurrentSortState({
            ...currentSortState,
            sortIcon: sortIcon.asc,
          })
        }
        setSortRollBy(null)
        break
    }
  }

  const onActiveRollAction = async (action: ActiveRollAction) => {
    if (action === "filter") {
      // set load to true & upadte toast message
      setToastState({
        message: "Saving...",
        visible: true,
      })
      setLoadIcon(true)
      callApi({
        student_roll_states: [...(data?.students ?? [])],
      })
        .then((_) => {
          setLoadIcon(false)
          setToastState({
            visible: true,
            message: "Roll Saved",
          })
          setTimeout(() => {
            setToastState({
              message: "",
              visible: false,
            })
          }, 3000)
        })
        .catch((error) => {
          console.log(error)
        })
    }
    data?.students.map((_, i) => {
      data.students[i].attendance = "unmark"
    })
    updateLocalstorage(data)
    setIsRollMode(false)
    setStudentAttendanceData({
      present: 0,
      late: 0,
      absent: 0,
    })
    setSortRollBy("unmark")
  }

  const onAttendanceChange = (index: number, attendanceType: string) => {
    if (data) {
      for (let i in data.students) {
        if (data.students[i].id === index) {
          data.students[i].attendance = attendanceType
        }
      }
      updateLocalstorage(data)
      setStudentAttendanceData({
        present: getTypeCount(data.students, "present"),
        absent: getTypeCount(data.students, "absent"),
        late: getTypeCount(data.students, "late"),
      })
    }
  }

  const updateLocalstorage = (data: { students: Person[] } | undefined) => {
    localStorage.removeItem(LocalStorageKey.students)
    localStorage.setItem(LocalStorageKey.students, JSON.stringify(data?.students))
  }

  const getTypeCount = (data: Person[], type: string) => {
    let count = 0
    data.forEach((element) => {
      if (type === element.attendance) count += 1
    })
    return count
  }

  const onSortRollChange = (sortByRoll: RolllStateType) => {
    data?.students.sort((a) => {
      let returnVal = 0
      if (a.attendance.match(sortByRoll)) {
        returnVal = returnVal - 1
      }

      return returnVal
    })
    updateLocalstorage(data)
    setSortRollBy(sortByRoll)
    setCurrentSortState({
      ...currentSortState,
      sortIcon: sortIcon.initial,
    })
  }

  // TO-DO
  const searchText = (searchQuery: string) => {
    data?.students.sort((a, b) => {
      let returnVal = 0
      if (a.first_name.toLowerCase().includes(searchQuery) || b.last_name.toLowerCase().includes(searchQuery)) {
        returnVal = returnVal - 1
      } else {
        return 0
      }
      return returnVal
    })
    updateLocalstorage(data)
    setSearchStudent(searchQuery)
  }

  return (
    <>
      <S.PageContainer>
        <Toolbar onItemClick={onToolbarAction} currentState={currentSortState} onSearch={searchText} />

        {loadState === "loading" && (
          <CenteredContainer>
            <FontAwesomeIcon icon="spinner" size="2x" spin />
          </CenteredContainer>
        )}

        {loadState === "loaded" && data?.students && (
          <>
            {data.students.map((s) => (
              <StudentListTile key={s.id} isRollMode={isRollMode} student={s} onAttendanceChange={onAttendanceChange} isViewMode={false} />
            ))}
          </>
        )}

        {loadState === "error" && (
          <CenteredContainer>
            <div>Failed to load</div>
          </CenteredContainer>
        )}

        <Toast toastState={toastState} />
      </S.PageContainer>

      <currestSortRoll.Provider value={sortRollBy}>
        <ActiveRollOverlay
          isActive={isRollMode}
          onItemClick={onActiveRollAction}
          totalStudentsCount={data?.students.length || 0}
          studentsData={studentAttendanceData}
          loadState={loadIcon}
          handleSortRoll={onSortRollChange}
        />
      </currestSortRoll.Provider>
    </>
  )
}

type ToolbarAction = "roll" | "sort" | "sortField"
interface ToolbarProps {
  currentState: sortState
  onItemClick: (action: ToolbarAction, value?: string) => void
  onSearch: Function
}
const Toolbar: React.FC<ToolbarProps> = (props) => {
  const { onItemClick, currentState, onSearch } = props
  return (
    <S.ToolbarContainer>
      <S.SortIcon>
        <FontAwesomeIcon onClick={() => onItemClick("sort")} icon={currentState.sortIcon as IconName} />
      </S.SortIcon>
      <S.Button onClick={() => onItemClick("sortField")} style={{ marginLeft: "1rem" }}>
        {currentState.stateName} Name
      </S.Button>

      <S.searchInput type="text" onChange={(e) => onSearch(e.target.value)} placeholder="Search student PS " />

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
      padding: ${Spacing.u3};
      font-weight: ${FontWeight.strong};
      border-radius: ${BorderRadius.default};
    }
  `,
  SortIcon: styled(Button)`
    position: absolute !important;
  `,
  searchInput: styled.input`
    padding: 0.5em;
    margin: 0.5em;
    border-radius: 25px;
    border: none;
    outline: none;
  `,
}
