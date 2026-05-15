import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ActivityList from "./pages/activites/ActivityList";
import ActivityDetail from "./pages/activites/ActivityDetail";
import TaskList from "./pages/task/TaskList";
import DetailTask from "./pages/task/DetailTask"; // Import DetailTask

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/activities" replace />} />
          <Route path="/activities" element={<ActivityList />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/task" element={<TaskList />} />
          <Route path="/tasks/:id" element={<DetailTask />} /> {/* New Route for Task Detail */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;