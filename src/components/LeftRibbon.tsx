import { useState } from "react";
import { Files, Search, ChartLine } from "lucide-react";

export default function LeftRibbon() {
    const [active, setActive] = useState("files");

    const buttonStyle = (name: string) =>
        `w-8 h-8 flex items-center justify-center rounded hover:bg-gray-700 ${
            active === name ? "bg-gray-700" : ""
        }`;

    return (
        <div className="w-10 bg-gray-900 text-white flex flex-col items-center py-2 space-y-2">
            <button
                title="Files"
                onClick={() => setActive("files")}
                className={buttonStyle("files")}
            >
                <Files size={16} />
            </button>
            <button
                title="Search"
                onClick={() => setActive("search")}
                className={buttonStyle("search")}
            >
                <Search size={16} />
            </button>
            <button
                title="graph"
                onClick={() => setActive("graph")}
                className={buttonStyle("graph")}
            >
                <ChartLine size={16} />
            </button>
        </div>
    );
}