import { StudentController } from "./controller/student-controller"
import { RollController } from "./controller/roll-controller"
import { GroupController } from "./controller/group-controller"

export const Routes = [
  {
    method: "get",
    route: "/student/get-all",
    controller: StudentController,
    action: "allStudents",
  },
  {
    method: "get",
    route: "/student/get-by-id",
    controller: StudentController,
    action: "getStudent",
  },
  {
    method: "post",
    route: "/student/create",
    controller: StudentController,
    action: "createStudent",
  },
  {
    method: "put",
    route: "/student/update",
    controller: StudentController,
    action: "updateStudent",
  },
  {
    method: "delete",
    route: "/student/delete",
    controller: StudentController,
    action: "removeStudent",
  },
  {
    method: "get",
    route: "/roll/get-all",
    controller: RollController,
    action: "allRolls",
  },
  {
    method: "get",
    route: "/roll/get-by-id",
    controller: RollController,
    action: "getRoll",
  },
  {
    method: "post",
    route: "/roll/create",
    controller: RollController,
    action: "createRoll",
  },
  {
    method: "put",
    route: "/roll/update",
    controller: RollController,
    action: "updateRoll",
  },
  {
    method: "delete",
    route: "/roll/delete",
    controller: RollController,
    action: "removeRoll",
  },
  {
    method: "post",
    route: "/roll/add-student-states",
    controller: RollController,
    action: "addStudentRollStates",
  },
  {
    method: "post",
    route: "/roll/add-student-roll-state",
    controller: RollController,
    action: "addStudentRollState",
  },
  {
    method: "put",
    route: "/roll/update-student-roll-state",
    controller: RollController,
    action: "updateStudentRollState",
  },
  // --- Group API Endpoints
  // Create Group
  {
    method: "post",
    route: "/group/create",
    controller: GroupController,
    action: "createGroup",
  },
  // Read / Get all Group
  {
    method: "get",
    route: "/group/get-all",
    controller: GroupController,
    action: "allGroups",
  },
  // Read / Get Group by ID
  {
    method: "get",
    route: "/group/get-by-id/:id",
    controller: GroupController,
    action: "getGroupByID",
  },
  // Update Group
  {
    method: "post",
    route: "/group/update",
    controller: GroupController,
    action: "updateGroup",
  },
  // Delete Group
  {
    method: "delete",
    route: "/group/delete/:id",
    controller: GroupController,
    action: "removeGroup",
  },
  // Get students in all group
  {
    method: "get",
    route: "/group/group-students",
    controller: GroupController,
    action: "getGroupStudents",
  },
  // Get students in a group by ID
  {
    method: "get",
    route: "/group/group-students/:id",
    controller: GroupController,
    action: "getGroupStudentsByID",
  },
]
