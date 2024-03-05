import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ReactGA from 'react-ga';
import APIInstance from '../api';
import Loading from '../components/Loading';

const URLRedirector: FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showText, setShowText] = useState('Redirecting');

  useEffect(() => {
    ReactGA.initialize('G-NMJTFS236X');
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
            
            // Generate unique click identifier
            const uniqueClickId = uuidv4();
            
            // Send data to Track.presspool.ai
            APIInstance.post('data/clicked', { id, ipAddress, uniqueClickId }).then(data => {
              window.open(data.data.url, '_self');
              
              // Send event to GA4
              ReactGA.event({
                category: 'Newsletter',
                action: 'Click',
                label: 'CTA',
                dimension1: uniqueClickId,
              });
            }).catch(err => {
              setShowText('Campaign Not Activated!');
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