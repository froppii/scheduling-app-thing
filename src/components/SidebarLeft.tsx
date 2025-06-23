import { Note } from "../types/Note";

type Props = {
  notes: Note[];
  activeNoteId: string | null;
  setActiveNoteId: (id: string) => void;
  createNote: () => void;
};


export default function SidebarLeft({ notes, activeNoteId, setActiveNoteId, createNote }: Props) {
    return (
        <div className="w-64 bg-gray-100 border-r flex flex-col">
            <div className="p-2 border-b flex justify-between items-center">
                <h2 className="text-sm font-bold">Notes</h2>
                <button
                    onClick={createNote}
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    + New
                </button>
            </div>
            <ul className="flex-1 overflow-auto">
                {notes.map((note) => (
                    <li
                        key={note.id}
                        className={`p-2 text-sm cursor-pointer hover:bg-blue-100 truncate ${
                            activeNoteId === note.id ? "bg-blue-100 font-semibold" : ""
                        }`}
                        onClick={() => setActiveNoteId(note.id)}
                    >
                        {note.title || "untitled"}
                    </li>
                ))}
            </ul>
        </div>
    );
}
