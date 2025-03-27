
export default function MenuIcon() {
    return(
    <div className="flex justify-end items-center">
        <div className="flex flex-row justify-end items-center">
        <nav className="flex space-x-4 text-2xl font-bold">
            <a href="#about" className="text-white"><u>A</u>bout</a>
            <a href="#projects" className="text-white"><u>P</u>rojects</a>
            <a href="#skills" className="text-white"><u>S</u>kills</a>
            <a href="#contact" className="text-white"><u>C</u>ontact</a>
        </nav>
        </div>
    </div>

    );
}