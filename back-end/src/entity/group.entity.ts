import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"
import { CreateGroup, UpdateGroup } from "../interface/group.interface"

@Entity()
export class Group {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  name: string

  @Column()
  number_of_weeks: number

  @Column()
  roll_states: string

  @Column()
  incidents: number

  @Column()
  ltmt: string

  @Column({
    nullable: true,
  })
  run_at: Date

  @Column()
  student_count: number

  public prepareToCreate(input: CreateGroup) {
    this.name = input.name
    this.number_of_weeks = input.number_of_weeks
    this.roll_states = input.roll_states
    this.incidents = input.incidents
    this.ltmt = input.ltmt
    this.student_count = input.student_count
  }

  public prepareToUpdate(input: UpdateGroup) {
    if (input.name !== undefined) this.name = input.name
    if (input.number_of_weeks !== undefined) this.number_of_weeks = input.number_of_weeks
    if (input.roll_states !== undefined) this.roll_states = input.roll_states
    if (input.incidents !== undefined) this.incidents = input.incidents
    if (input.ltmt !== undefined) this.ltmt = input.ltmt
    if (input.student_count !== undefined) this.student_count = input.student_count
  }
}
