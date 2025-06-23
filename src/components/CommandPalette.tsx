import { useEffect, useRef, useState } from "react";

interface Command {
    label: string;
    action: () => void;
}

type Props = {
    onClose: () => void;
};

export default function CommandPalette({ onClose }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState("");
    const [commands, setCommands] = useState<Command[]>([]);

    useEffect(() => {
        inputRef.current?.focus();
        setCommands([
            { label: "Create New Note", action: () => console.log("Create note") },
            { label: "Toggle Dark Mode", action: () => console.log("Toggle theme") },
        ]);

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    const filtered = commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center pt-32">
            <div className="bg-white dark:bg-gray-900 rounded shadow-lg w-full max-w-lg">
                <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Type a command..."
                    className="w-fll px-4 py-2 text-sm bg-transparent outline-none border-b border-gray-200 dark:border-gray-700"
                />
                <ul className="max-h-64 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                    {filtered.map((cmd, idx) => (
                        <li
                            key={idx}
                            className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => {
                                cmd.action();
                                onClose();
                            }}
                        >
                            {cmd.label}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}