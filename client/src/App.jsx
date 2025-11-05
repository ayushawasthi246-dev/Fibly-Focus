import LandingPage from './pages/LandingPage.jsx'
import {Routes, Route } from 'react-router-dom'
import Layout from './layout/layout.jsx'

import Login from './auth/pages/Login.jsx'
import Singup from './auth/pages/Singup.jsx'
import Forget_password from './auth/pages/Forget_password.jsx'
import Verify_email from './auth/pages/Verify_email.jsx'
import TaskKanban from './features/Kanban/pages/KanbantasksPage.jsx'
import KanbanPage from './features/Kanban/pages/kanbanpage.jsx'
import Calendar from './features/calendar/pages/calendar.jsx'
import PomodoroCircle from './features/promodoro/pages/promodoro_timmer.jsx'
import Focus_mode from './features/focus_mode/pages/focus_mode.jsx'
import Timer from './features/focus_mode/pages/timer.jsx'
import Dashboard from './features/Dashboard/pages/dashboard.jsx'
import Analytics from './features/analytics/pages/analytics.jsx'

import { ToastContainer } from 'react-toastify'

function App() {
  return (
      <div>
        <ToastContainer />
        <Routes>
          <Route element={<Layout />}>
            <Route path='/kanban' element={<KanbanPage />} />
            <Route path='/kanban/:id' element={<TaskKanban />} />
            <Route path='/calendar' element={<Calendar />} />
            <Route path='/Pomodoro-timer' element={<PomodoroCircle />} />
            <Route path='/Focus-mode' element={<Focus_mode />} />
            <Route path='/Dashboard' element={<Dashboard />} />
            <Route path='/Analytics' element={<Analytics />} />
          </Route>
          <Route path='/Focus-mode/:id' element={<Timer />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/login' element={<Login />} />
          <Route path='/singup' element={<Singup />} />
          <Route path='/verifyemail' element={<Verify_email />} />
          <Route path='/resetpassword' element={<Forget_password />} />
        </Routes>
      </div>
  );
}

export default App;
