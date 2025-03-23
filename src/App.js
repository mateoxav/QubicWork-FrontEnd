import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import PostTask from './pages/PostTask';
import Profile from './pages/Profile';
import { AuthProvider } from './contexts/AuthContext';
import { ConfigProvider } from './contexts/ConfigContext';
import { QubicConnectCombinedProvider } from './contexts/QubicConnectContext';
import { HM25Provider } from './contexts/HM25Context';
import { Toaster } from 'react-hot-toast'
import { WalletConnectProvider } from './contexts/WalletConnectContext';
import { QubicConnectProvider } from './contexts/QubicConnectContext';

function App() {
  return (
    <AuthProvider>
      <ConfigProvider>
        <QubicConnectCombinedProvider>
          <HM25Provider>
            <WalletConnectProvider>
            <QubicConnectProvider>
            <Router>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/marketplace" element={<Marketplace />} />
                    <Route path="/post-task" element={<PostTask />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/login" element={<LoginForm />} />
                    <Route path="/register" element={<RegistrationForm />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </Router>
            </QubicConnectProvider>
            </WalletConnectProvider>
            <Toaster position="bottom-center" /> {/* Include Toaster if using toast notifications */}
          </HM25Provider>
        </QubicConnectCombinedProvider>
      </ConfigProvider>
    </AuthProvider>
  );
}

export default App;