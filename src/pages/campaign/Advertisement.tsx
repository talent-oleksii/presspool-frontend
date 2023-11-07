import { FC } from 'react';
import { useParams } from 'react-router';

const Advertisement: FC = () => {
    const { id } = useParams();

    console.log('id:', id);
    
    return (
        <div className='p-5 text-left'>
            <h2 className='font-[Inter] text-2xl'>Manage Advertisement</h2>
        </div>
    );
};

export default Advertisement;