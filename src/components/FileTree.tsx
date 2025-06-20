type Props = {
    notes: { id: string; title: string }[];
    setActiveNoteId: (id: string) => void;
    createNote: () => void;
};

export default function FileTree({ notes, setActiveNoteId, createNote }: Props) {
    return (
        <div className="flex flex-col h-full justify-between p-2">
            <div>
                <button
                    className="mb-2 px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={createNote}
                >
                    + New Note
                </button>
                <ul>
                    {notes.map((note) => (
                        <li
                            key={note.id}
                            className="cursor-pointer hover:bg-gray-100 p-1"
                            onClick={() => setActiveNoteId(note.id)}
                        >
                            {note.title}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="text-center text-xs text-gray-600 mt-2">
                <div>📆 June 2025</div>
            </div>
        </div>
    );
}