import { Router, Route, A } from '@solidjs/router';
import { LanguageProvider } from './components/LanguageContext';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import ForgotPasswordPage from './pages/ForgotPassword';
import ResetPasswordPage from './pages/ResetPassword';
import CaraKerjaPage from './pages/CaraKerja';
import TestimoniTabungin from './pages/Testimoni';
import DownloadPage from './pages/Download';

import DashboardPage from './pages/Dashboard';
import DashboardAnalysics from './pages/DashboardAnalysics';
import DashboardPengaturan from './pages/DashboardPengaturan';
import DashboardPengguna from './pages/DashboardPengguna';
import DashboardTestimoni from './pages/DashboardTestimoni';

import NotifikasiPage from './pages/Notifikasi';
import Beranda from './pages/Beranda';
import Fitur from './pages/Fitur';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <Route path="/" component={LandingPage} />
        <Route path="/Login" component={LoginPage} />
        <Route path="/Register" component={RegisterPage} />
        <Route path="/forgot-password" component={ForgotPasswordPage} />
        <Route path="/reset-password" component={ResetPasswordPage} />
        <Route path="/CaraKerja" component={CaraKerjaPage} />
        <Route path="/Testimoni" component={TestimoniTabungin}/>
        <Route path="/Download" component={DownloadPage}/>

        <Route path="/Dashboard" component={DashboardPage}/>
        <Route path="/DashboardAnalysics" component={DashboardAnalysics}/>
        <Route path="/DashboardPengaturan" component={DashboardPengaturan}/>
        <Route path="/DashboardPengguna" component={DashboardPengguna}/>
        <Route path="/DashboardTestimoni" component={DashboardTestimoni}/>

        <Route path="/Notifikasi" component={NotifikasiPage}/>
        <Route path="/Beranda" component={Beranda}/>
        <Route path="/Fitur" component={Fitur}/>
      </Router>
    </LanguageProvider>
  );
}
