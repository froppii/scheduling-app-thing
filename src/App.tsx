import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Calendar from './pages/Calendar';
import Sidebar from './components/Sidebar';
import { CalendarEvent } from './types';
import { v4 as uuidv4 } from 'uuid';

const Settings = () => <div className="p-4">Settings Page</div>;
const Profile = () => <div className="p-4">Profile Page</div>;
const Dashboard = () => <div className="p-4">Dashboard Page</div>;


function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [showModal, setShowModal] = useState(false);

  const addEvent = (data: { title: string; date: string, description: string }) => {
    const newEvent: CalendarEvent = {
      id: uuidv4(),
      title: data.title,
      date: new Date(data.date).toISOString(),
      description: data.description,
    };
    setEvents([...events, newEvent]);
  };

  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <Routes>
            {/* temporary */}
            {/* <Route
              path="/"
              element={<Login onLogin={() => setIsAuthenticated(true)} />}
            />
            <Route
              path="/signup"
              element={<Signup onSignup={() => setIsAuthenticated(true)} />}
            /> */}
        
            <Route
              path="/Calendar"
              element={
                <Calendar
                  events={events}
                  addEvent={addEvent}
                  showModal={showModal}
                  setShowModal={setShowModal}
                />
              }
            />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/Calendar" replace />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
