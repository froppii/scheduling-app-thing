import { useState } from "react";

export default function RenameNoteModal({
    isOpen,
    onClose,
    currentTitle,
    onRename,
} : {
    isOpen: boolean;
    onClose: () => void;
    currentTitle: string;
    onRename: (newTitle: string) => void;
}) {
    const [newTitle, setNewTitle] = useState(currentTitle);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-4 rounded shadow-md w-96">
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    Rename Note
                </h2>
                <input 
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
                />
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-1 bg-gray-300 dark:bg-gray-600 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => {
                            onRename(newTitle);
                            onClose();
                        }}
                    >
                        Rename
                    </button>
                </div>
            </div>
        </div>
    );
}