import React, { useState, useRef, useEffect } from "react";
import { Note } from "../types/Note";
import { 
    DndContext, 
    closestCenter, 
    PointerSensor, 
    useSensor, 
    useSensors 
} from "@dnd-kit/core";
import { 
    arrayMove,
    SortableContext,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Notebook } from "lucide-react";

type Props = {
    notes: Note[];
    activeNoteId: string | null;
    setActiveNoteId: (id: string) => void;
    onRenameRequest: (noteId: string, newTitle: string) => void;
    onReorder: (newOrder: Note[]) => void;
    onDeleteRequest: (id: string) => void;
    onDuplicateRequest: (id: string) => void;
};

export default function Tabs({ 
    notes, 
    activeNoteId, 
    setActiveNoteId, 
    onRenameRequest,
    onReorder,
}: Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [contextMenu, setContextMenu] = useState<{ x: Number; y: Number; id: string } | null>(null);
    
    const inputRef = useRef<HTMLInputElement>(null);

    const sensors = useSensors(useSensor(PointerSensor));

    useEffect(() => {
        if (editingId && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
        e.preventDefault();
        setContextMenu({ x: e.pageX, y: e.pageY, id });
    };

    const handleRename = (id: string) => {
        const note = notes.findIndex((n) => n.id === id);
        if (note) {
            setEditingId(id);
            setEditTitle(note.title);
        }
        setContextMenu(null);
    };

    const handleDelete = (id: string) => {
        onDeleteRequest(id);
        setContextMenu(null);
    };

    const handleDuplicate = (id: string) => {
        onDuplicateRequest(id);
        setContextMenu(null);
    };

    const handleReorder = (event: any) => {
        const { active, over } = event;
        if (active.id !== over?.id) {
            const oldIndex = notes.findIndex((n) => n.id === active.id);
            const newIndex = notes.findIndex((n) => n.id === over?.id);
            const reOrdered = arrayMove(notes, oldIndex, newIndex);
            onReorder(reOrdered);
        }
    };

    return (
        <div className="relative">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleReorder}
                modifiers={[restrictToHorizontalAxis]}
            >
                <SortableContext
                    items={notes.map((note) => note.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex bg-gray-200 border-b h-10">
                        {notes.map((note) => (
                            <SortableTab 
                                key={note.id}
                                id={note.id}
                                note={note}
                                activeNoteId={activeNoteId}
                                setActiveNoteId={setActiveNoteId}
                                onRenameRequest={onRenameRequest} 
                                editingId={editingId}                               editingId={editingId}
                                setEditingId={setEditingId}  
                                inputRef={inputRef}
                                editTitle={editTitle}
                                setEditTitle={setEditTitle}                              setEditTittle={setEditTitle}
                                handleContextMenu={handleContextMenu}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {contextMenu && (
                <div
                    className="absolute z-50 bg-white show-md border rounded"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        className="px-4 py-2 hocer:bg-gray-100 w-full text-left"
                        onClick={() => handleDuplicate(contextMenu.id)}
                    >
                        Duplicate
                    </button>
                    <button
                        className="px-4 py-2 hover:bg-gray-100 w-full text-left text-red-500"
                        onClick={() => handleDelete(contextMenu.id)}
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

function SortableTabProps = {
    id:string;
    note: Note;
    activeNoteId: string | null;
    setActiveNoteId: (id: string) => void;
    onRenameRequest: (id: string, title: string) => void;
    editingId: string | null;
    setEditingId: (id: string | null) => void;
    inputRef: RefObject<HTMLInputElement>;
    handleContextMenu: (e: React.MouseEvent<HTMLInputElement>, id: string) => void;
    onDeleteRequest: (id: string) => void;
};

function SortableTab({
    id,
    note,
    activeNoteId,
    setActiveNoteId,
    onRenameRequest,
    editingId,
    setEditingId,
    inputRef,
    handleContextMenu,
    onDeleteRequest,
}: SortableTabProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };
}
    return (
        <button
            ref={setNodeRef}
            style={style}
            className={`px-2 text-sm flex items-center border-r hover:bg-gray-300 h-10 relative ${note.id === activeNoteId ? "bg-white font-semibold" : "text-gray-600"}`}
            onClick={() => setActiveNoteId(note.id)}
            onContextMenu={(e) => handleContextMenu(e, note.id)}
            onDoubleClick={() => setEditingId(note.id)}
            {...attributes}
            {...listeners}
            >
                {editingId === note.id ? (
                    <input 
                        ref={inputRef}
                        className="bg-white border p-1 text-sm"
                        defaultValue={note.title}
                        onBlur={(e) => {
                            onRenameRequest(note.id, e.target.value);
                            setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                onRenameRequest(note.id, (e.target as HTMLInputElement).value);
                                setEditingId(null);
                            }
                        }}
                    />
                ) : (
                    <>
                    <span className="pr-3">{note.title || "untitled"}</span>
                    <span
                        className="absolute right-1 text-gray-400 hover:text-red-500 cursor-pointer"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this tab?")) {
                                onDeleteRequest(note.id);
                            }
                        }}    
                    >
                        ×
                    </span>
                    </>
                )}
        </button>
    );
}