import { FC, useEffect, useState } from "react";
import APIInstance from "../../api";
import Loading from "../../components/Loading";

const Campaign: FC = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [searchKey, setSearchKey] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setSearchLoading(true);
    APIInstance.get('admin/data/campaign', { params: { searchKey } }).then(data => {
      setCampaigns(data.data);
    }).catch(err => {
      console.log('error:', err);
    }).finally(() => setSearchLoading(false));
  }, [searchKey]);

  return (
    <div>
      <input
        value={searchKey}
        onChange={e => setSearchKey(e.target.value)}
        className="px-4 py-2 font-[Inter] border-[1px] border-black w-full rounded-[10px] text-lg bg-white"
        placeholder="Search by campaign name"
      />
      <div className="border-[1px] border-black w-full h-[300px] my-2 rounded-[10px] bg-white relative overflow-auto py-3">
        {searchLoading && <Loading />}

        {
          campaigns.map((item: any) => (
            <div className="text-center w-full" key={item.id}>{item.name}</div>
          ))
        }
      </div>
    </div>
  );
};

export default Campaign;