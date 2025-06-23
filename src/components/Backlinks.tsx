import { Note } from "../types/Note";

export default function Backlinks({ currentNote, notes }: {
    currentNote: Note | undefined;
    notes: Note[];
}) {
    if (!currentNote) return null;

    const backlinks = notes.filter((note) =>
        note.id !== currentNote.id && note.content.includes(`[[${currentNote.title}]]`)
    );

    return (
        <div className="p-2 border-t text-sm">
            <h3 className="text-xs font-bold text-gray-600 mb-1">Backlinks</h3>
            {backlinks.length === 0 ? (
                <p className="text-gray-400 italic">No backlinks</p>
            ) : (
                <ul className="space-y-1">
                    {backlinks.map((note) => (
                        <li key={note.id} className="text-blue-600 hover:underline cursor-pointer">
                            {note.title || "Untitled"}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}