import { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './routing'

function App() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showLogoutConfirm) {
        if (e.key === 'Escape') {
          setShowLogoutConfirm(false);
          return;
        }
        if (e.key === 'Enter') {
          handleLogout();
          return;
        }
      }

      if (e.key === 'Escape') {
        const activeTag = document.activeElement?.tagName;
        if (activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT') {
          // Don't navigate back immediately if escaping from an input, just blur it
          document.activeElement.blur();
          return;
        }

        const currentPath = router.state.location.pathname;

        // Root paths where we should prompt for logout instead of going back
        if (currentPath === '/companylist' || currentPath.startsWith('/dashboard')) {
          setShowLogoutConfirm(true);
        } else if (currentPath !== '/login' && currentPath !== '/') {
          // Go back for any other page
          router.navigate(-1);
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showLogoutConfirm])

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setShowLogoutConfirm(false);
    router.navigate('/login', { replace: true });
  };

  return (
    <>
      <RouterProvider router={router} />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm transition-all shadow-2xl">
          <div className="bg-white rounded-2xl p-6 w-[400px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-gray-100 transform scale-100 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-4 text-rose-600">
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
              </div>
              <h2 className="text-xl font-black uppercase tracking-wider">Confirm Logout</h2>
            </div>
            <p className="mb-6 text-gray-600 font-medium">Are you sure you want to exit the secure session? Any unsaved changes might be lost.</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-5 py-2.5 rounded-xl border-2 border-slate-200 font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all"
              >
                Stay Logged In
              </button>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 rounded-xl bg-rose-600 font-bold text-white hover:bg-rose-700 shadow-lg shadow-rose-200 transition-all"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
