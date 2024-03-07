import { FC, useEffect, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { DatePicker } from "antd";

import AdminDashboardOverview from "./dashboard/Overview";
import ADminDashboardCampaign from './dashboard/Campaign';
import AdminDashboardClient from "./dashboard/Client";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/authSlice";
import SelectList from "./dashboard/SelectList";
import AdminAPIInstance from "../../api/adminApi";
import Loading from "../../components/Loading";

const AdminDashboard: FC = () => {
  const location = useLocation();
  const navigator = useNavigate();
  const { adminName, adminRole } = useSelector(selectAuth);
  const [loading, setLoading] = useState(false);

  console.log('role:', adminRole);
  const [range, setRange] = useState<any>([]);
  const [accountManagers, setAccountManagers] = useState<Array<any>>([]);
  const [clients, setClients] = useState<Array<any>>([]);
  const [campaigns, setCampaigns] = useState<Array<any>>([]);

  const [currentAM, setCurrentAM] = useState<any>(0);
  const [currentClient, setCurrentClient] = useState<any>(0);
  const [currentCampaign, setCurrentCampaign] = useState<any>(0);

  useEffect(() => {
    if (!location.pathname.includes('/overview') && !location.pathname.includes('/campaign') && !location.pathname.includes('/client'))
      navigator('/admin/dashboard/overview');
    setLoading(true);
    Promise.all([
      AdminAPIInstance.get('/user/account-manager'),
    ]).then((results: Array<any>) => {
      setAccountManagers(results[0].data);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log('am:', currentAM);
    if (currentAM === 0) return;
    setLoading(true);
    setClients([]);
    setCampaigns([]);
    AdminAPIInstance.get('/users', { params: { accountManager: currentAM } }).then(data => {
      setClients(data.data);
    }).finally(() => setLoading(false));
  }, [currentAM]);

  useEffect(() => {
    if (currentClient === 0 || clients.length <= 0) return;
    console.log('dfdf:', clients, currentClient);

    setLoading(true);
    setCampaigns([]);
    AdminAPIInstance.get('/campaign', { params: { client: clients.find((value) => value.id === currentClient).email } }).then(data => {
      setCampaigns(data.data);
    }).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentClient]);

  return (
    <div className="w-full flex relative">
      {loading && <Loading />}
      <div className="text-left flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-[Inter] font-semibold -tracking-[.6px] text-[20px]">{`Welcome ${adminName} 🤝`}</h2>
            <p className="mt-1 text-[#43474a] font-[Inter] text-xs">Here's a snapshot of Presspool.ai, all in one place</p>
          </div>

          <DatePicker.RangePicker
            className='font-[Inter] rounded-[15px] py-[10px] border-[#7F8182] w-[230px]'
            onChange={(e) => setRange(e)}
          />
        </div>
        <div className="mt-4">
          <button
            className={`inline-flex items-center justify-center text-[#505050] text-[14px] font-semibold px-4 py-[10px] font-[Inter] rounded-[15px] sm:w-[170px] me-4 bg-white border border-solid border-main shadow-md`}
          >
            Overview
          </button>
          <SelectList
            name={`${currentAM === 0 || !accountManagers.find((value) => value.id === currentAM) ? 'By Account Manager' : accountManagers.find((value) => value.id === currentAM).name}`}
            setValue={(v: any) => setCurrentAM(v)}
            items={accountManagers}
            id={currentAM}
          />
          <SelectList
            name={`${currentClient === 0 || !clients.find((value) => value.id === currentClient) ? 'By Client' : clients.find((value) => value.id === currentClient).name}`}
            setValue={(v: any) => setCurrentClient(v)}
            items={clients}
            id={currentAM}
          />
          <SelectList
            name={`${currentCampaign === 0 || !campaigns.find((value) => value.id === currentCampaign) ? 'By Campaign' : campaigns.find((value) => value.id === currentCampaign).name}`}
            setValue={(v: any) => setCurrentCampaign(v)}
            items={campaigns}
            id={currentCampaign}
          />
        </div>

        <div className="mt-4">
          <Routes>
            <Route path="/overview" element={<AdminDashboardOverview />} />
            <Route path="/campaign/:id" element={<ADminDashboardCampaign />} />
            <Route path="/client" element={<AdminDashboardClient />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;