interface Props {
  skills: string[]; // Array of skill strings to be displayed
}

export default function SkillTags({ skills }: Props) {
  return (
    // Container for the skill badges, providing flexible layout and gap
    <div className="flex flex-wrap gap-2">
      {skills.length === 0 ? (
        // Display a message if no skills are provided
        <p className="text-sm text-gray-500 dark:text-gray-400">No skills listed.</p>
      ) : (
        // Map over the skills array to render each skill as a badge
        skills.map(skill => (
          <span
            key={skill} // Unique key for each skill badge
            className="
              text-xs font-medium px-3 py-1 rounded-full
              bg-blue-100 text-blue-800
              dark:bg-blue-700 dark:text-blue-100
              transition-colors duration-200
              shadow-sm
            "
          >
            {skill}
          </span>
        ))
      )}
    </div>
  );
}
