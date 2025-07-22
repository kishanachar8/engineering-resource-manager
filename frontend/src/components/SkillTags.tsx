interface Props {
  skills: string[]
}

export default function SkillTags({ skills }: Props) {
  return (
    <div className="flex flex-wrap gap-1">
      {skills.map(skill => (
        <span key={skill} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md">
          {skill}
        </span>
      ))}
    </div>
  )
}
