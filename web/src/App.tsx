import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import Page from './app/dashboard/page';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-800 mb-4">Sistema de Mentoria</h1>
                  <p className="text-gray-600 mb-8">Bem-vindo ao seu sistema de mentoria</p>
                  <a 
                    href="/dashboard" 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
                  >
                    Acessar Dashboard
                  </a>
                </div>
              </div>
            } 
          />
          <Route path="/dashboard" element={<Page />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
