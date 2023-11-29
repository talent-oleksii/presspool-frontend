import React, { useEffect, useRef, useImperativeHandle, forwardRef, useState } from 'react';
import { Tooltip } from 'react-tooltip';

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
    <div className='grid grid-cols-2 h-full w-full'>
      <div className='col-span-1 text-left mt-36'>
        <div className='text-left me-2 rounded-md'>
          <div className='flex justify-between'>
            <p className='font-[Inter] text-sm 2xl:text-md font-semibold mb-0'>
              Campaign Headline
              {asterick && headLine.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
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
          <Tooltip id='headline' place="bottom">
            <div className="whitespace-pre-wrap break-normal w-[250px]">
              The headline of your campaign. This should be roughly 7 words
              or less and have a specific outcome.
              (Ex. Presspool will 10x user growth without PR)
            </div>
          </Tooltip>
          <p className='font-[Inter] mt-2 text-sm 2xl:text-md font-semibold' data-tooltip-id='body'>
            Campaign Body
            {asterick && body.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
          </p>
          <textarea
            className={`mt-1 mb-0 text-sm 2xl:text-md w-full rounded-lg border-[1px] py-2 px-3 ${asterick && body.length <= 0 ? 'border-[red]' : 'border-[#7F8182]'}`}
            maxLength={110}
            value={body}
            onChange={e => setBody(e.target.value)}
            rows={5}
            data-tooltip-id='body'
          />
          <Tooltip id='body' place="bottom">
            <div className="whitespace-pre-wrap break-normal w-[250px]">
              The body of your campaign. This should be 500 characters or less and describe how you can help your ideal customer or audience achieve the promise from the headline.
            </div>
          </Tooltip>
          <p className='font-[Inter] text-sm 2xl:text-md font-semibold mt-1 mb-0'>
            CTA
            {asterick && cta.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
          </p>
          <input
            className={`mt-[7px] w-full rounded-lg text-sm 2xl:text-md border-[1px] py-2 px-3 ${asterick && cta.length <= 0 ? 'border-[red]' : 'border-[#7F8182]'}`}
            maxLength={20}
            value={cta}
            data-tooltip-id='cta'
            onChange={e => setCta(e.target.value)}
          />
          <Tooltip id='cta' place="bottom">
            <div className="whitespace-pre-wrap break-normal w-[250px]">
              The call to action for your button. This should be something like "Free trial" or "Learn more" or "Try for free"
            </div>
          </Tooltip>
          <p className='font-[Inter] text-sm 2xl:text-md font-semibold mt-2 mb-0'>
            Hero Image
            {asterick && (!image || (image && image.length <= 0)) && <span className='ms-1 text-[red]'>*</span>}
          </p>
          <p className='mt-[3px] text-[#7f8182] font-[Inter] text-[13px] font-medium mb-0'>Click here to add your iamge</p>
          <button
            data-tooltip-id='hero'
            onClick={() => { if (fileInputRef.current) fileInputRef.current.click(); }}
            className={`overflow-hidden truncate px-2 text-sm 2xl:text-md py-2 flex items-center justify-center text-gray-800 text-left font-[Inter] w-[160px] border-dashed border-[1px] bg-white rounded mt-1 ${asterick && (!image || (image && image.length <= 0)) ? 'border-[red]' : 'border-gray-400'}`}
          >
            {file ? file.name :
              <>
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg" className='me-2'>
                  <path d="M1 14.3945V16.3945C1 16.925 1.21071 17.4337 1.58579 17.8087C1.96086 18.1838 2.46957 18.3945 3 18.3945H15C15.5304 18.3945 16.0391 18.1838 16.4142 17.8087C16.7893 17.4337 17 16.925 17 16.3945V14.3945M4 6.39453L9 1.39453M9 1.39453L14 6.39453M9 1.39453V13.3945" stroke="#7FFBAE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className='text-[#7FFBAE] font-[Inter] text-sm'>Upload image</span>
              </>
            }
          </button>
          <Tooltip id='hero' place="bottom">
            <div className="whitespace-pre-wrap break-normal">
              1200px x 600px
            </div>
          </Tooltip>
          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept='image/*'
            onChange={handleFileChange}
          />
          <p className='font-[Inter] text-sm 2xl:text-md font-semibold mt-2 mb-0'>
            URL for your landing page
            {asterick && pageUrl.length <= 0 && <span className='ms-1 text-[red]'>*</span>}
          </p>
          <input
            type="url"
            value={pageUrl}
            data-tooltip-id='url'
            onChange={e => setPageUrl(e.target.value)}
            className={`mt-1 w-full rounded-lg text-sm 2xl:text-md border-[1px] focus:ring-0 focus:border-[#7FFBAE] py-2 px-3 ${asterick && pageUrl.length <= 0 ? 'border-[red]' : 'border-[#7F8182]'}`}
          />
          <Tooltip id='url' place="bottom">
            <div className="whitespace-pre-wrap break-normal">
              Where do you want to direct the clicks to?
            </div>
          </Tooltip>
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
        <div className='bg-white z-10 w-full rounded-[5px]'>
          <div className=''>
            <div className='py-4 px-2 flex items-center justify-center'>
              <img src={!image ? SampleLogo : image} alt="sample logo" className='h-[30px] object-cover' />
            </div>
            <div className='py-3 px-2 flex flex-col items-center justify-center'>
              <h2 className='w-full text-left font-bold text-[Inter] text-md break-words'>{headLine}</h2>
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