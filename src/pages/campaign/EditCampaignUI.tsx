import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Tooltip } from 'antd';

import SampleLogo from '../../assets/logo/logo.png';

import APIInstance from '../../api';
import DialogUtils from '../../utils/DialogUtils';

interface typeEditCampaignUI {
  setLoading: Function;
  uiData?: any;
  afterChange?: Function;
}

const EditCampaignUI = forwardRef((props: typeEditCampaignUI, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [headLine, setHeadLine] = useState('Lorem ipsum dolor sit amet, consectetur adipiscing elit');
  const [body, setBody] = useState('Labore et dolore magina alqua, Ut enim ad minim veniam, quis nostrud exercitation ulamco laboris nisi ut aliquip');
  const [cta, setCta] = useState('Call To Action');
  const [image, setImage] = useState<any>(null);
  const [file, setFile] = useState<any>('');
  const [pageUrl, setPageUrl] = useState('');
  const [noNeedCheck, setNoNeedCheck] = useState(false);
  const [asterick, setAsterick] = useState(false);

  useEffect(() => {
    if (props.uiData) {
      setHeadLine(props.uiData.headline);
      setBody(props.uiData.body);
      setCta(props.uiData.cta);
      setImage(props.uiData.image);
      setNoNeedCheck(Number(props.uiData.no_need_check) === 1 ? true : false);
      setPageUrl(props.uiData.page_url || '');
    }
  }, [props]);

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;
      if (file.size > 50000) {
        DialogUtils.show('error', 'Error While Uploading the file', "File Size can not be larger than 50 KB");
        return;
      }
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };

      reader.readAsDataURL(file);
    }
  };

  useImperativeHandle(ref, () => ({
    handleSave,
  }));

  const handleSave = () => {
    return new Promise((resolve, reject) => {
      if (headLine.length <= 0 || body.length <= 0 || cta.length <= 0 || (!image || (image && image.length <= 0)) || pageUrl.length <= 0) {
        setAsterick(true);
        return;
      }
      setAsterick(false);
      props.setLoading(true);
      APIInstance.put('data/campaign_ui', {
        id: props.uiData.ui_id,
        headLine,
        cta,
        body,
        image,
        pageUrl,
        noNeedCheck: noNeedCheck ? 1 : 0,
      }).then(data => {
        console.log('data:', data);
        if (props.afterChange) props.afterChange(data.data);
        resolve(true);
      }).catch(err => {
        console.log('error:', err);
        reject();
      }).finally(() => props.setLoading(false));
    });
  };

  return (
    <div className='grid grid-cols-2 gap-12 h-full w-full'>
      <div className='col-span-1 text-left mt-36'>
        <div className='text-left me-2 rounded-md'>
          <div className='flex justify-between'>
            <p className='font-[Inter] text-sm 2xl:text-md font-semibold mb-0 flex'>
              Campaign Headline
              {asterick && headLine.length <= 0 && <span className='ms-1 text-[red]'>*</span>}

              <Tooltip
                title="The headline of your campaign. This should be roughly 7 words
                or less and have a specific outcome.
                (Ex. Presspool will 10x user growth without PR)"
                color='#EDECF2'
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1'>
                  <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
              </Tooltip>
            </p>
            {/* <p className='font-[Inter] text-sm text-gray-400'>{`${headLine.length}/60`}</p> */}
          </div>
          <input
            className={`mt-1 w-full rounded-lg text-sm 2xl:text-md border-[1px] py-2 px-3 ${asterick && headLine.length <= 0 ? 'border-[red]' : 'border-[#7F8182]'}`}
            maxLength={60}
            data-tooltip-id='headline'
            value={headLine}
            onChange={e => setHeadLine(e.target.value)}
          />
          <p className='font-[Inter] mt-2 text-sm 2xl:text-md font-semibold flex'>
            Campaign Body
            {asterick && body.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
            <Tooltip
              title="The body of your campaign. This should be 500 characters or less and describe how you can help your ideal customer or audience achieve the promise from the headline."
              color='#EDECF2'
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1'>
                <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </Tooltip>
          </p>
          <textarea
            className={`mt-1 mb-0 text-sm 2xl:text-md w-full rounded-lg border-[1px] py-2 px-3 ${asterick && body.length <= 0 ? 'border-[red]' : 'border-[#7F8182]'}`}
            maxLength={110}
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
            data-tooltip-id='body'
          />
          <p className='font-[Inter] text-sm 2xl:text-md font-semibold mt-1 mb-0 flex'>
            CTA
            {asterick && cta.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
            <Tooltip
              title='The call to action for your button. This should be something like "Free trial" or "Learn more" or "Try for free"'
              color='#EDECF2'
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1'>
                <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </Tooltip>
          </p>
          <input
            className={`mt-[7px] w-full rounded-lg text-sm 2xl:text-md border-[1px] py-2 px-3 ${asterick && cta.length <= 0 ? 'border-[red]' : 'border-[#7F8182]'}`}
            maxLength={20}
            value={cta}
            data-tooltip-id='cta'
            onChange={e => setCta(e.target.value)}
          />
          <p className='font-[Inter] text-sm 2xl:text-md font-semibold mt-2 mb-0 flex'>
            Hero Image
            {asterick && (!image || (image && image.length <= 0)) && <span className='ms-1 text-[red]'>*</span>}
            <Tooltip
              title='1200px x 600px'
              color='#EDECF2'
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1'>
                <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </Tooltip>
          </p>
          <p className='mt-[3px] text-[#7f8182] font-[Inter] text-[13px] font-medium mb-0'>Click here to add your image</p>
          <div className='flex mt-[7px]'>
            <button
              data-tooltip-id='hero'
              onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}
              className={`overflow-hidden truncate px-2 text-sm 2xl:text-md py-2 flex items-center justify-center text-gray-800 text-left font-[Inter] w-[160px] border-dashed border-[1px] bg-white rounded ${asterick && (!image || (image && image.length <= 0)) ? 'border-[red]' : 'border-[#7F8182]'}`}
            >
              <>
                <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" className='me-1 -ms-1'>
                  <path fill='#505050' d="M460-336.923v-346l-93.231 93.231-28.308-28.769L480-760l141.539 141.539-28.308 28.769L500-682.923v346h-40ZM264.615-200Q237-200 218.5-218.5 200-237 200-264.615v-96.923h40v96.923q0 9.23 7.692 16.923Q255.385-240 264.615-240h430.77q9.23 0 16.923-7.692Q720-255.385 720-264.615v-96.923h40v96.923Q760-237 741.5-218.5 723-200 695.385-200h-430.77Z" />
                </svg>
                <span className='text-[#7F8182] font-[Inter] text-sm'>Upload image</span>
              </>
            </button>
            {
              image &&
              <div className='relative ms-2 cursor-pointer' onClick={() => { setFile(''); setImage(null); }}>
                <img src={image} alt="sample logo" className='h-[42px] object-cover' />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='w-[18px] h-[18px] 2xl:w-[24px] 2xl:h-[24px] absolute -top-1 right-0'>
                  <path fill="red" d="m336-307.692 144-144 144 144L652.308-336l-144-144 144-144L624-652.308l-144 144-144-144L307.692-624l144 144-144 144L336-307.692ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120Z" />
                </svg>
              </div>
            }
          </div>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept='image/*'
            onChange={handleFileChange}
          />
          <p className='font-[Inter] text-sm 2xl:text-md font-semibold mt-2 mb-0 flex'>
            URL for your landing page
            {asterick && pageUrl.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
            <Tooltip
              title='Where do you want to direct the clicks to?'
              color='#EDECF2'
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" className='h-[20px] w-[20px] 2xl:w-[24px] 2xl:h-[24px] ms-1'>
                <path d="M460-300h40v-220h-40v220Zm20-276.923q10.462 0 17.539-7.077 7.076-7.077 7.076-17.539 0-10.461-7.076-17.538-7.077-7.077-17.539-7.077-10.462 0-17.539 7.077-7.076 7.077-7.076 17.538 0 10.462 7.076 17.539 7.077 7.077 17.539 7.077ZM480.134-120q-74.673 0-140.41-28.339-65.737-28.34-114.365-76.922-48.627-48.582-76.993-114.257Q120-405.194 120-479.866q0-74.673 28.339-140.41 28.34-65.737 76.922-114.365 48.582-48.627 114.257-76.993Q405.194-840 479.866-840q74.673 0 140.41 28.339 65.737 28.34 114.365 76.922 48.627 48.582 76.993 114.257Q840-554.806 840-480.134q0 74.673-28.339 140.41-28.34 65.737-76.922 114.365-48.582 48.627-114.257 76.993Q554.806-120 480.134-120ZM480-160q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
              </svg>
            </Tooltip>
          </p>
          <input
            type="url"
            value={pageUrl}
            data-tooltip-id='url'
            onChange={e => setPageUrl(e.target.value)}
            className={`mt-1 w-full rounded-lg text-sm 2xl:text-md border-[1px] focus:ring-0 focus:border-[#7FFBAE] py-2 px-3 ${asterick && pageUrl.length <= 0 ? 'border-[red]' : 'border-[#7F8182]'}`}
          />
        </div>
      </div>
      <div className='col-span-1 bg-[#43434A] h-full sm:max-h-[80vh] overflow-hidden relative flex flex-col items-center bg-[#43474A] rounded-[5px] px-2 py-4'>
        {/* Content for Campaign */}
        <div className='bg-[#D1CEFF] w-full flex items-center justify-center py-3 rounded-[14px]'>
          <p className='text-black border-black border-[5px] p-3 text-base 2xl:text-lg font-bold'>ALOGO</p>
        </div>

        <p className='text-gray-200 my-4 text-sm'>
          Happy Friday AI legends,
          <br />
          Today we are diving deep into some of the newest AI solutions that are taking place this week.
          <br />
          With GPT’s just being released, the excitement has continued to grow at an unprecedented rate for AI products and solutions that are reshaping how consumers and executives alike do their work better, faster and easier.
        </p>
        <div className='bg-white z-10 h-full w-full rounded-[5px]'>
          <div className=''>
            <div className='py-4 px-2 flex items-center justify-center'>
              <img src={!image ? SampleLogo : image} alt="sample logo" className='h-[30px] object-cover' />
            </div>
            <div className='py-3 px-2 flex flex-col items-center justify-center'>
              <h2 className='w-full text-left font-bold font-[Inter] text-md break-words'>{headLine}</h2>
              <p className='mt-4 w-full text-left font-[Inter] text-gray-500 text-sm break-words'>{body}</p>
              <div className='mt-4 flex justify-between w-full items-center'>
                <button className='font-[Inter] text-gray-500 px-4 py-2 rounded text-sm border-[1px] font-medium'>{cta}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default EditCampaignUI;