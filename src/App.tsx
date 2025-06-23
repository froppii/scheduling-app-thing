import LeftRibbon from "./components/LeftRibbon";
import SidebarLeft from "./components/SidebarLeft";
import EditorPane from "./components/EditorPane";
import Tabs from "./components/Tabs";
import StatusBar from "./components/StatusBar";
import CommandPalette from "./components/CommandPalette";
import RenameNoteModal from "./components/RenameNoteModal";
import { useState, useEffect } from "react";
import { Note } from "./types/Note";
import Tags from "./components/Tags";
import Backlinks from "./components/Backlinks";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

const LOCAL_STORAGE_KEY = "notes";

export default function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if(stored) {
      const parsed: Note[] = JSON.parse(stored);
      setNotes(parsed);
      if (parsed.length > 0) setActiveNoteId(parsed[0].id);
    } else {
      const newNote: Note = {
        id: Date.now().toString(),
        title: "Welcome",
        content: "# Welcome\nThis is your first note. You can edit this or create a new one.",
      };
      setNotes([newNote]);
      setActiveNoteId(newNote.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const createNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title:"Untitled",
      content: "",
    };
    setNotes((prev) => [...prev, newNote]);
    setActiveNoteId(newNote.id);
  };

  const updateNote = (id: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) => (note.id === id ? { ...note,content } : note))
    );
  };

  const renameNote = (newTitle: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === activeNoteId ? { ...note, title: newTitle } : note
      )
    );
  };


  const activeNote = notes.find((n) => n.id === activeNoteId);

  useKeyboardShortcuts({
    toggleCommandPalette: () => setShowCommandPalette((prev) => !prev),
    createNote,
  });

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <div className="flex flex-1">
        <LeftRibbon />
        <SidebarLeft 
          notes={notes}
          activeNoteId={activeNoteId}
          setActiveNoteId={setActiveNoteId}
          createNote={createNote}
        />
        <div className="flex-1 flex flex-col">
          <Tabs 
            notes={notes}
            activeNoteId={activeNoteId}
            setActiveNoteId={setActiveNoteId}
          />
          {activeNote ? (
            <div className="flex-1 flex flex-col">
              <div className="flex-1 flex">
                <EditorPane
                  note={activeNote}
                  updateNote={updateNote}
                  preview={false}
                />
                <EditorPane 
                  note={activeNote}
                  updateNote={updateNote}
                  preview={true}
                />
              </div>
              <div className="flex border-t text-xs">
                <Tags currentNote={activeNote} />
                <Backlinks currentNote={activeNote} notes={notes} />
              </div>
            </div>
           ) : (
            <div className="flex-1 p-8 text-center text-gray-400 text-sm">
              No note selected. Use the sidebar to create or select a note.
            </div>
           )}
        </div>
      </div>
      <StatusBar />
      {showCommandPalette && (
        <CommandPalette 
          onClose={() => setShowCommandPalette(false)}
          actions={{
            rename: () => setShowRenameModal(true),
            create: createNote,
          }}
        />
      )}
      <RenameNoteModal 
        isOpen={showRenameModal}
        currentTitle={activeNote?.title || ""}
        onRename={renameNote}
        onClose={() => setShowRenameModal(false)}
      />
    </div>
  );
}
