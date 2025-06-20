type Props = {
    notes: { id: string; title: string }[];
    activeId: string | null;
    setActiveNoteId: (id: string) => void;
};

export default function Tabs({ notes, activeId, setActiveNoteId }: Props) {
    return (
        <div className="flex bg-gray-100 border-b">
            {notes.map((note) => (
                <button
                    key={note.id}
                    className={`px-4 py-2 ${note.id === activeId ? "bg-white border-t broder-l border-r" : "text-gray-600"}`}
                    onClick={() => setActiveNoteId(note.id)}
                >
                    {note.title}
                </button>
            ))}
        </div>
    );
}