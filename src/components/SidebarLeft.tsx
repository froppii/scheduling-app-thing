import { Note } from "../types/Note";

type Props = {
    notes: Note[];
    activeNoteId: string | null;
    setActiveNoteId: (id:string) => void;
    createNote: () => void;
};

export default function SidebarLeft({ notes, activeNoteId, setActiveNoteId, createNote }: Props) {
    return (
        <div className="w-64 bg-gray-100 border-r flex flex-col">
            <div className="p-2 border-b flex justify-between items-center"
            <button onClick={createNote} className="mb-4">New Note</button>
            {notes.map((note) => (
                <div
                    key={note.id}
                    className={`p-2 cursor-pointer ${note.id === activeNoteId ? "bg-gray-200" : ""}`}
                    onClick={() => setActiveNoteId(note.id)}
                >
                    {note.title || "Untitled"}
                </div>
            ))}
        </div>
    );
}
