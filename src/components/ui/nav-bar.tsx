export default function Navbar() {
    return (
      <nav className="p-5 bg-white shadow-md fixed w-full z-10">
        <div className="container mx-auto flex justify-between">
          <h1 className="text-xl font-bold">Srijan K.</h1>
          <ul className="flex space-x-4">
            <li><a href="#projects" className="hover:text-blue-500">Projects</a></li>
            <li><a href="#skills" className="hover:text-blue-500">Skills</a></li>
            <li><a href="#contact" className="hover:text-blue-500">Contact</a></li>
          </ul>
        </div>
      </nav>
    );
  }
  