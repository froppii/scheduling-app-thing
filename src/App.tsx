import { Note } from "../types/Note";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "../styles/markdown.css";

type Props = {
  note?: Note;
  updateNote: (id: string, content: string) => void;
  preview?: boolean;
};

export default function EditorPane({ note, updateNote, preview = false }: Props) {
  if (!note) return <div className="flex-1 p-4 text-gray-500">No note selected</div>;

  return (
    <div className="flex-1 border-l border-gray-200 p-4 overflow-auto">
      {preview ? (
        <ReactMarkdown className="prose dark:prose-invert max-w-none" remarkPlugins={[remarkGfm]}>
          {note.content || "Nothing to preview."}
        </ReactMarkdown>
      ) : (
        <textarea
          className="w-full h-full resize-none outline-none bg-transparent text-sm font-mono"
          value={note.content}
          onChange={(e) => updateNote(note.id, e.target.value)}
        />
      )}
    </div>
  );
}
