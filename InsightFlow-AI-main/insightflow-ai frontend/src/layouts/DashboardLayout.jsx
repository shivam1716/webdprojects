import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import Navbar from '../components/layout/Navbar'
import NewProjectModal from '../components/ui/NewProjectModal'

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-canvas text-ink font-sans">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <Navbar 
          onMenuClick={() => setSidebarOpen(true)} 
          onNewProject={() => setModalOpen(true)}
        />
        <main className="flex-1 px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
          <div className="mx-auto w-full max-w-7xl animate-fade-up">
            <Outlet context={{ openNewProjectModal: () => setModalOpen(true) }} />
          </div>
        </main>
      </div>
      <NewProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
