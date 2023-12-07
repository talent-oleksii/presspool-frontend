import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import APIInstance from '../api';
import Loading from '../components/Loading';
import { setFlagsFromString } from 'v8';

const URLRedirector: FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState('Redirecting');
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
            }).catch(err => {

              setShowText('Campaign Not Activated!');
              console.log('err:', err);
            }).finally(() => setLoading(false));
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
        <h3 className='font-[Inter] font-bold'>{showText}</h3>
        {loading && <Loading />}
      </div>
    </div>
  );
};

export default URLRedirector;