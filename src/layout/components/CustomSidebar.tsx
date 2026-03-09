
import { CustomLogo } from "./CustomLogo"
import { CustomFooterSidebar } from "./CustomFooterSidebar"
import { CustomNavContent } from "./CustomNavContent"

export function CustomSidebar() {

  return (
    <aside className="hidden md:flex w-64 min-w-64 max-w-64 shrink-0 flex-col border-r bg-card">
      <CustomLogo/>

      {/* Navigation */}
      <CustomNavContent/>

      <CustomFooterSidebar/>
    </aside>
  )
}