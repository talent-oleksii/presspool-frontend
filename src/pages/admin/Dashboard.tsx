import { FC } from "react";
import { Link, Route, Routes } from "react-router-dom";
import AdminDashboardOverview from "./dashboard/Overview";

const AdminDashboard: FC = () => {

  return (
    <div className="min-h-screen w-full text-left">
      <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">Welcome To Admin Dashboard 🤝</h2>
      <p className="mt-1 text-[#43474a] font-[Inter] text-sm">Here's a snapshot of Presspool.ai, all in one place</p>

      <div className="flex w-full items-center justify-between mt-4">
        <div className="flex">
          <Link to="/admin/dashboard/overview" className="text-[#505050] font-semibold text-sm px-4 py-2 min-w-[175px]">Overview</Link>
          <Link to="/admin/dashboard/campaign" className="text-[#505050] font-semibold text-sm px-4 py-2 min-w-[175px]">Campaigns</Link>
          <Link to="/admin/dashboard/client" className="text-[#505050] font-semibold text-sm px-4 py-2 min-w-[175px]">Clients</Link>
        </div>
      </div>

      <Routes>
        <Route path="/overview" element={<AdminDashboardOverview />} />
      </Routes>
    </div>
  );
};

export default AdminDashboard;