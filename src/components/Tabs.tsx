import { Note } from "../types/Note";

type Props = {
    notes: Note[];
    activeNoteId: string | null;
    setactiveNoteId: (id: string) => void;
};

export default function Tabs({ notes, activeNoteId, setActiveNoteId }: Props) {
    return (
        <div className="flex bg-gray-200 border-b h-10">
            {notes.map((note) => (
                <button
                    key={note.id}
                    className={`px-4 text-sm flex items-center border-r hover:bg-gray-300 ${
                        note.id === activeNoteId ? "bg-white font-semibold" : "text-gray-600"
                    }`}
                    onClick={() => setActiveNoteId(note.id)}
                >
                    {note.title || "untitled"}
                </button>
            ))}
        </div>
    );
}