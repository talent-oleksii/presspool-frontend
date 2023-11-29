import { FC } from 'react';
import './InfoDialog.css'; // Import your custom stylesheet

interface typeInfoDialog {
  title: string,
  content: string,
  onClose: React.MouseEventHandler<HTMLButtonElement>,
  type?: string,
};

const InfoDialog: FC<typeInfoDialog> = ({ type, title, content, onClose }) => {
  return (
    <div className="info-dialog-overlay">
      <div className="info-dialog">
        <div className='w-full flex-col flex items-center justify-center'>
          {type && type === 'success' &&
            <div className='flex flex-col items-center justify-center'>
              <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="none">
                <path d="M75.0009 6.69946C82.5424 11.0537 88.8158 17.3021 93.2002 24.826C97.5847 32.3498 99.928 40.8883 99.9984 49.5961C100.069 58.304 97.8636 66.8792 93.6012 74.4729C89.3389 82.0666 83.1672 88.4155 75.6971 92.891C68.227 97.3666 59.7176 99.8136 51.0111 99.9898C42.3047 100.166 33.7032 98.0653 26.0581 93.8957C18.413 89.726 11.9895 83.6321 7.42342 76.217C2.85735 68.802 0.30705 60.323 0.0250009 51.6194L0 49.9994L0.0250009 48.3794C0.30502 39.7444 2.81777 31.3293 7.31829 23.9544C11.8188 16.5796 18.1535 10.4967 25.7048 6.29887C33.2561 2.10103 41.7662 -0.0685539 50.4057 0.00165123C59.0451 0.0718564 67.5189 2.37945 75.0009 6.69946ZM68.5358 36.4645C67.6749 35.6036 66.5294 35.0864 65.3142 35.01C64.0991 34.9336 62.8978 35.3032 61.9358 36.0495L61.4658 36.4645L45.0006 52.9244L38.5355 46.4645L38.0655 46.0494C37.1034 45.3037 35.9023 44.9346 34.6875 45.0112C33.4726 45.0879 32.3274 45.605 31.4667 46.4658C30.606 47.3265 30.0888 48.4716 30.0121 49.6865C29.9355 50.9013 30.3046 52.1024 31.0504 53.0644L31.4654 53.5344L41.4655 63.5344L41.9355 63.9494C42.8124 64.6298 43.8907 64.999 45.0006 64.999C46.1104 64.999 47.1887 64.6298 48.0656 63.9494L48.5356 63.5344L68.5358 43.5344L68.9509 43.0644C69.6971 42.1024 70.0667 40.9012 69.9903 39.686C69.9139 38.4709 69.3967 37.3254 68.5358 36.4645Z" fill="#4BDE6B" />
              </svg>
              <h2 className='mt-[12px] font-[Inter] text-black text-[20px] font-semibold'>{title.length > 0 ? title : 'Success!'}</h2>
            </div>
          }
          {
            type && type === 'error' &&
            <div className='flex flex-col items-center justify-center'>
              <div className='w-[95px] h-[95px] flex items-center justify-center bg-[#D22A2A] rounded-full'>
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="49" viewBox="0 0 6 49" fill="none">
                  <path d="M3 3.38867V24.4998M3 45.6109H3.05278" stroke="white" strokeWidth="4.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className='mt-[12px] font-[Inter] text-black text-[20px] font-semibold'>{title.length > 0 ? title : 'Something Wrong'}</h2>
            </div>
          }

          <div className="mt-[10px]">
            <p className='text-[15px] font-[Inter] text-normal text-[#43474a]'>{content}</p>
          </div>
          <button onClick={onClose} className='mt-[25px] bg-[#7FFBAE] rounded-[5px] px-[52px] py-[11px] font-[Inter] text-white text-sm font-semibold'>OK</button>
        </div>
      </div>
    </div>
  );
};

export default InfoDialog;