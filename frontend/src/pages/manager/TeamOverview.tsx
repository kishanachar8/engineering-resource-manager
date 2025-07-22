import { useEffect } from 'react'
import API from '../../lib/axios'
import { useUserStore } from '../../store/userStore'
import { useAssignmentStore } from '../../store/assignmentStore'
import CapacityBar from '../../components/CapacityBar'
import SkillTags from '../../components/SkillTags'

export default function TeamOverview() {
  const { users, setUsers } = useUserStore()
  const { assignments, setAssignments } = useAssignmentStore()

  useEffect(() => {
    const fetchData = async () => {
      const usersRes = await API.get('/engineers')
      const assignRes = await API.get('/assignments')
      setUsers(usersRes.data)
      setAssignments(assignRes.data)
    }

    fetchData()
  }, [])

  const calculateUsedCapacity = (engineerId: string) => {
    const engineerAssignments = assignments.filter(a => a.engineerId === engineerId)
    return engineerAssignments.reduce((total, a) => total + a.allocationPercentage, 0)
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Team Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((engineer) => {
          const used = calculateUsedCapacity(engineer._id)
          const available = engineer.maxCapacity - used

          return (
            <div key={engineer._id} className="p-4 rounded-xl border shadow">
              <h3 className="font-medium text-lg">{engineer.name}</h3>
              <p className="text-sm text-muted-foreground">{engineer.seniority} • {engineer.employmentType}</p>

              <div className="mt-2">
                <CapacityBar used={used} max={engineer.maxCapacity} />
              </div>

              <div className="mt-2 text-sm text-muted-foreground">
                Allocated: {used}% • Available: {available}%
              </div>

              <div className="mt-3">
                <SkillTags skills={engineer.skills} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
