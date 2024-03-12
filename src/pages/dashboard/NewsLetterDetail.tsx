import { FC } from 'react';

const NewsLetterDetail: FC = () => {
  return (
    <div>
      <div className='mt-2 bg-white rounded-[10px] p-4'>
        <div className='text-gray-700 font-[Inter] text-md'>
          Performance By:

          <span className='rounded-[10px] bg-gray-900 px-3 py-1 text-white ms-3'>NewsLetter</span>
          <table className='w-full fot-[Inter] mt-5'>
            <thead>
              <tr className='border-b-[1px] border-gray-300'>
                <th className='w-2/6 py-2 px-1'>NEWSLETTER</th>
                <th className='w-1/6'>SPEND</th>
                <th className='w-1/6'>REACH</th>
                <th className='w-1/6'>CLICKS</th>
                <th className='w-1/6'>CTR</th>
              </tr>
            </thead>
            <tbody>
              <tr className='border-b-[1px] border-gray-300'>
                <td className='py-2 px-2'>Good Energy Email</td>
                <td>$6000</td>
                <td>4641</td>
                <td>2</td>
                <td>0.04%</td>
              </tr>
              <tr className='border-b-[1px] border-gray-300'>
                <td className='py-2 px-2'>Today Food</td>
                <td>$9000</td>
                <td>18488</td>
                <td>3</td>
                <td>0.02%</td>
              </tr>
              <tr className='border-b-[1px] border-gray-300'>
                <td className='py-2 px-2'>FMG Newsletter</td>
                <td>$3000</td>
                <td>4633</td>
                <td>1</td>
                <td>0.02%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NewsLetterDetail;