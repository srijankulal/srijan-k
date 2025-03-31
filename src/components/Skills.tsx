export default function Skills() {
  return (
    <div className="w-full my-16 px-4 sm:px-6 lg:px-8" id="skills">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 text-left pl-22">Skills</h2>
      <div className="flex flex-col justify-center items-center w-full pt-6 lg:pt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
          <div className="terminal-style-skills w-full">
            <h3 className="text-lg sm:text-xl font-mono mb-2 text-amber-600">$ cat frontend.txt</h3>
            <pre className="text-base sm:text-xl lg:text-2xl overflow-x-auto">
      {`┌─────────────────────┐
        │ Frontend            │
        ├─────────────────────┤      
        │ >> React/Next.js    │
        │ >> TypeScript       │
        │ >> Tailwind CSS     │
        │ >> Flutter          │
        └─────────────────────┘`}
            </pre>
          </div>
          
          <div className="terminal-style-skills w-full">
            <h3 className="text-lg sm:text-xl font-mono mb-2 text-amber-600">$ cat backend.txt</h3>
            <pre className="text-base sm:text-xl lg:text-2xl overflow-x-auto">
    {`  ┌─────────────────────┐
        │ Backend             │
        ├─────────────────────┤
        │ >> Python/Flask     │
        │ >> Node.js          │
        │ >> PostgreSQL       │
        │ >> RESTful APIs     │
        └─────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
