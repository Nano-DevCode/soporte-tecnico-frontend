import { Outlet } from "react-router";
import { CustomFooter } from "./components/CustomFooter";
import { CustomAppSidebar } from "./components_v2/CustomAppSidebar";
import { useState } from "react";
import { CustomAppHeader } from "./components_v2/CustomAppHeader";
import { useTicketSockets } from "@/tickets/hooks/useTicketSockets";

const PanelLayoutV2 = () => {
    useTicketSockets()
    const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1024);

    const handleSidebarClose = () => {
        setSidebarOpen(false);
    }

    const handleSidebarToogle = () => {
        setSidebarOpen(!sidebarOpen)
    }

    return (
        <div className="flex h-screen min-h-0 w-full overflow-hidden">
            {sidebarOpen && (
                <button
                    type="button"
                    aria-label="Cerrar menú lateral"
                    className="fixed inset-0 z-40 h-full w-full border-none bg-black/50 outline-none transition-opacity lg:hidden"
                    onClick={handleSidebarClose}
                />
            )}

            <CustomAppSidebar
                isOpen={sidebarOpen}
                onClose={handleSidebarClose}
            />
            <div className="flex flex-1 flex-col min-w-0 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                <CustomAppHeader
                    onSidebarToggle={handleSidebarToogle}
                />

                <main className="flex-1  p-4 md:p-6 lg:p-8">
                    <div className="mx-auto">
                        <Outlet />
                    </div>
                </main>

                <CustomFooter />
            </div>
        </div>
    )
}

export default PanelLayoutV2;