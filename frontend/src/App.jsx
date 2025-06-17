
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './components/LoginPage';
import AdminDashboard from './pages/AdminDash';
import PracticalList from './components/PracticalList';
import EditPracticalForm from './components/EditPracticalForm';
import SubjectPage from './components/SubjectPage';
import PracticalDetail from './components/PracticalDetail';
import StudentSubmitForm from './components/StudentSubmitForm';
import AdminSubmissionsReview from './components/AdminSubmissionsReview';

function App() {
  return (
   <Routes>
    <Route path='/' element={<LandingPage/>}/>
    <Route path='/admin-login' element={<LoginPage/>}/>
    <Route path='/admin-dashboard' element={<AdminDashboard/>}/>
    <Route path="/admin/practicals" element={<PracticalList />} />
    <Route path="/admin/practicals/edit/:id" element={<EditPracticalForm />} />
    <Route path="/subjects/:subjectId" element={<SubjectPage />} />
    <Route path="/practicals/:id" element={<PracticalDetail />} />
    <Route path='/contribute' element={<StudentSubmitForm/>}/>
    <Route path='/review' element={<AdminSubmissionsReview/>}/>
    </Routes>
 );
}

export default App;