const EventModal = ({ isOpen, onClose, onSave}: any) => {
    const [title, setTitle] = useState('');
    const [date, setDate] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="bg-white p-4 rounded shadow-md w-80">
                <h2 className="text-lg font-bold mb-2">Add Event</h2>
                <input
                    type="text"
                    placeholder="Event Title"
                    className="border p-1 w-full mb-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="date"
                    className="border p-1 w-full mb-2"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white py-1 px-2 rounded"
                    onClick={() => {
                        onSave({ title, date });
                        onClose();
                    }}
                >
                    Save
                </button>
                <button className="ml-2 text-gray-500" onClick={onClose}>Cancel</button>
            </div>
        </div>
    );
};