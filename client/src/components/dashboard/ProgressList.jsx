export const ProgressList = ({ projects = [] }) => (
  <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <h3 className="mb-4 text-base font-semibold text-ink">Project Progress</h3>
    <div className="space-y-4">
      {projects.length === 0 && <p className="text-sm text-slate-500">No projects yet.</p>}
      {projects.map((project) => (
        <div key={project.id}>
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-medium text-slate-700">{project.name}</span>
            <span className="text-slate-500">{project.progress}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-accent" style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      ))}
    </div>
  </div>
);
