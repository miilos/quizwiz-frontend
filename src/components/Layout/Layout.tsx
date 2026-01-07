import { Outlet } from "react-router"

function Layout() {
  return (
    <>
      <div className="layout-container">
        <Outlet />
      </div>
    </>
  )
}

export default Layout