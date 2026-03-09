import { Outlet } from "react-router";
import { CustomHeader } from "./components/CustomHeader";
import { CustomSidebar } from "./components/CustomSidebar";
import { CustomFooter } from "./components/CustomFooter";


const PanelLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <CustomSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <CustomHeader />
        <main className="flex-1 px-4 py-10 sm:px-6 lg:px-16">
          <div className="mx-auto max-w-7xl space-y-4 sm:space-y-6">

            <Outlet/>
            
          </div>
        </main>
        <CustomFooter/>
      </div>
    </div>
  )
}

export default PanelLayout;