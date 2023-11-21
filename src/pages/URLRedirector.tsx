import { FC, useEffect } from 'react';
import { useParams } from 'react-router';
import APIInstance from '../api';
import Loading from '../components/Loading';

const URLRedirector: FC = () => {
  const { id } = useParams();
  useEffect(() => {
    document.title = 'loading...';

    return () => {
      document.title = 'loading...';
    };
  }, []);

  useEffect(() => {
    if (id) {
      fetch('https://api.ipify.org?format=json')
        .then(data => {
          data.json().then(data => {
            const ipAddress = data.ip;
            APIInstance.post('data/clicked', { id, ipAddress }).then(data => {
              window.open(data.data.url, '_self');
            }).catch(err => console.log('err:', err));
          });
        })
        .catch(error => {
          console.error('Error fetching IP address:', error);
        });
    }
  }, [id]);

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div>
        <h3 className='font-[Inter] font-bold'>Redirecting</h3>
        <Loading />
      </div>
    </div>
  );
};

export default URLRedirector;