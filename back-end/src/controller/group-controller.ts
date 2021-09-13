import { NextFunction, Request, Response } from "express"
import { getRepository } from "typeorm"
import { GroupStudent } from "../entity/group-student.entity"
import { Group } from "../entity/group.entity"
import { StudentRollState } from "../entity/student-roll-state.entity"
import { Student } from "../entity/student.entity"
import { CreateGroup, UpdateGroup } from "../interface/group.interface"

export class GroupController {
  private groupRepository = getRepository(Group)
  private groupStudentRepository = getRepository(GroupStudent)
  private studentRepository = getRepository(Student)
  private studentRollState = getRepository(StudentRollState)

  async allGroups(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Return the list of all groups
    return this.groupRepository.find()
  }

  async getGroupByID(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Return the list of all groups
    return await this.groupRepository.findOne({ id: request.params.id })
  }

  async createGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Add a Group
    const { body: params } = request

    const createGroup: CreateGroup = {
      name: params.name,
      number_of_weeks: params.number_of_weeks,
      roll_states: params.roll_states,
      incidents: params.incidents,
      ltmt: params.ltmt,
      student_count: params.student_count,
    }
    // initalise class
    const group = new Group()
    group.prepareToCreate(createGroup)

    return this.groupRepository.save(group)
  }

  async updateGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Update a Group
    const { body: params } = request

    const updateGroup: UpdateGroup = {
      id: params.id,
      name: params.name,
      number_of_weeks: params.number_of_weeks,
      roll_states: params.roll_states,
      incidents: params.incidents,
      ltmt: params.ltmt,
      student_count: params.student_count,
    }
    // initalise class
    const group = new Group()
    group.prepareToUpdate(updateGroup)

    return this.groupRepository.update(updateGroup.id, group)
  }

  async removeGroup(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Delete a Group
    let groupToRemove = await this.groupRepository.findOne(request.params.id)
    return await this.groupRepository.remove(groupToRemove)
  }

  async getGroupStudents(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Return the list of Students that are in a Group
    const group_student = await this.groupRepository.find()
    const groupsData = []
    for (let i in group_student) {
      const groupStudent = await this.groupStudentRepository.find({ group_id: group_student[i].id })
      let studentsData = []
      for (let j in groupStudent) {
        let studentByCurrentGroup = await this.studentRepository.findOne({ id: groupStudent[j].student_id })
        studentsData.push({
          ...studentByCurrentGroup,
          full_name: studentByCurrentGroup.first_name + " " + studentByCurrentGroup.last_name,
        })
      }
      groupsData.push({
        ...group_student[i],
        studentsData: [...studentsData],
      })
    }

    return groupsData
  }

  async getGroupStudentsByID(request: Request, response: Response, next: NextFunction) {
    // Task 1:
    // Return the list of Students that are in a Group
    const groupDetails = await this.groupRepository.findOne({ id: request.params.id })
    const groupStudent = await this.groupStudentRepository.find({ group_id: request.params.id })
    const studentsData = []
    for (let i in groupStudent) {
      let currentStudent = await this.studentRepository.findOne({ id: groupStudent[i].student_id })
      studentsData.push({
        ...currentStudent,
        full_name: currentStudent.first_name + " " + currentStudent.last_name,
      })
    }

    return {
      ...groupDetails,
      studentsData,
    }
  }

  async runGroupFilters(request: Request, response: Response, next: NextFunction) {
    // Task 2:
    // 1. Clear out the groups (delete all the students from the groups)
    const groupStudent = await this.groupStudentRepository.find()
    await this.groupStudentRepository.remove(groupStudent)
    // 2. For each group, query the student rolls to see which students match the filter for the group
    const groups = await this.groupRepository.find()
    for (let i in groups) {
      const [studentsFilterData, studentCount] = await this.studentRollState.findAndCount({ state: groups[i].roll_states })
      await this.groupRepository.update(
        {
          id: groups[i].id,
        },
        {
          run_at: new Date(),
          student_count: studentCount,
        }
      )
      for (let j in studentsFilterData) {
        await this.groupStudentRepository.insert({
          student_id: studentsFilterData[j].student_id,
          group_id: groups[i].id,
          incident_count: groups[i].incidents,
        })
      }
    }
    // 3. Add the list of students that match the filter to the group
    const group_student = await this.groupRepository.find()
    const groupsData = []
    for (let i in group_student) {
      const groupStudent = await this.groupStudentRepository.find({ group_id: group_student[i].id })
      let studentsData = []
      for (let j in groupStudent) {
        let studentByCurrentGroup = await this.studentRepository.findOne({ id: groupStudent[j].student_id })
        studentsData.push({
          ...studentByCurrentGroup,
          full_name: studentByCurrentGroup.first_name + " " + studentByCurrentGroup.last_name,
        })
      }
      groupsData.push({
        ...group_student[i],
        studentsData: [...studentsData],
      })
    }

    return groupsData
  }
}
