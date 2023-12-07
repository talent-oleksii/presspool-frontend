import { FC } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Link, useLocation } from 'react-router-dom';

import Dashboard from './Dashboard';
import Company from './Company';
import Campaign from './Campaign';
import Newsletter from './Creator';

const Admin: FC = () => {
  const location = useLocation();

  return (
    <div className="bg-gray-100 flex justify-between gap-5 pl-2 pt-3.5 pb-1.5 items-start max-md:flex-wrap">
      <div className="flex basis-[0%] flex-col items-stretch">
        <div className="flex items-stretch justify-between gap-1">
          <img
            loading="lazy"
            srcSet="..."
            className="aspect-[1.19] object-contain object-center w-[25px] overflow-hidden shrink-0 max-w-full"
          />
          <div className="bg-zinc-300 self-center w-[175px] shrink-0 h-[15px] my-auto" />
        </div>
        <div className="bg-green-300 flex items-stretch justify-between gap-3 mt-5 pl-3 pr-20 py-5 rounded-2xl max-md:pr-5">
          <img
            loading="lazy"
            srcSet="..."
            className="aspect-[1.06] object-contain object-center w-[19px] overflow-hidden shrink-0 max-w-full"
          />
          <div className="text-black text-xs font-semibold my-auto">
            Add a new user
          </div>
        </div>
        <div className="text-black text-sm font-semibold bg-white justify-center mt-3 pl-3.5 pr-16 py-3.5 rounded-2xl items-start max-md:pr-5">
          <span className="font-semibold"> </span>
          <span className="font-semibold">⌂</span>
          <span className="font-semibold"> </span>
          <span className="font-medium">Dashboard</span>
        </div>
        <div className="flex flex-col mt-5 pl-3.5 pr-20 items-start max-md:pr-5">
          <div className="flex items-stretch justify-between gap-5">
            <div className="text-black text-lg font-medium whitespace-nowrap">
              ☻
            </div>
            <div className="text-black text-xs font-medium my-auto">
              Clients
            </div>
          </div>
          <div className="flex items-stretch gap-4 mt-5">
            <img
              loading="lazy"
              srcSet="..."
              className="aspect-[1.33] object-contain object-center w-5 overflow-hidden shrink-0 max-w-full"
            />
            <div className="text-black text-xs font-medium">Campaigns</div>
          </div>
          <div className="flex items-stretch gap-4 mt-5">
            <img
              loading="lazy"
              srcSet="..."
              className="aspect-[1.33] object-contain object-center w-5 overflow-hidden shrink-0 max-w-full"
            />
            <div className="text-black text-xs font-medium my-auto">
              Billing
            </div>
          </div>
          <div className="flex items-stretch gap-4 mt-5">
            <img
              loading="lazy"
              srcSet="..."
              className="aspect-[1.2] object-contain object-center w-[18px] overflow-hidden shrink-0 max-w-full"
            />
            <div className="text-black text-xs font-medium mt-1">Support</div>
          </div>
        </div>
      </div>
      <div className="self-stretch flex grow basis-[0%] flex-col max-md:max-w-full">
        <div className="self-stretch px-5 max-md:max-w-full">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[45%] max-md:w-full max-md:ml-0">
              <div className="flex grow flex-col items-stretch mt-10 max-md:mt-10">
                <div className="text-black text-xl font-semibold tracking-tight whitespace-nowrap">
                  Welcome &123;First Name&125; 🤝
                </div>
                <div className="flex items-stretch justify-between gap-5 mt-3">
                  <div className="flex grow basis-[0%] flex-col items-stretch">
                    <div className="text-zinc-700 text-sm">
                      Here’s a snapshot of Presspool.ai, all in one place
                    </div>
                    <div className="flex items-stretch justify-between gap-5 mt-5">
                      <div className="text-neutral-600 text-sm font-semibold border bg-white grow justify-center items-stretch py-4 rounded-2xl border-solid border-green-300">
                        {" "}
                        Overview
                      </div>
                      <div className="text-neutral-600 text-sm font-semibold my-auto">
                        Campaigns
                      </div>
                    </div>
                  </div>
                  <div className="text-neutral-600 text-sm font-semibold mt-12 max-md:mt-10">
                    Clients
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[32%] ml-5 max-md:w-full max-md:ml-0">
              <div className="text-neutral-600 text-sm font-semibold border bg-white grow justify-center items-stretch w-full mt-28 pl-5 pr-9 py-4 rounded-2xl border-solid border-zinc-500 max-md:mt-10 max-md:px-5">
                Start Date -&gt; End Date
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[23%] ml-5 max-md:w-full max-md:ml-0">
              <div className="flex flex-col items-center max-md:mt-10">
                <div className="flex items-stretch justify-between gap-5">
                  <div className="bg-green-200 flex items-stretch justify-between gap-1 px-2 py-1 rounded-xl">
                    <img
                      loading="lazy"
                      srcSet="..."
                      className="aspect-[0.92] object-contain object-center w-[11px] overflow-hidden shrink-0 max-w-full"
                    />
                    <div className="text-green-400 text-xs font-medium self-center grow whitespace-nowrap my-auto">
                      Beta feedback
                    </div>
                  </div>
                  <div className="z-[1] flex items-stretch justify-between gap-1">
                    <div className="text-black text-xs font-medium whitespace-nowrap aspect-square justify-center items-stretch pl-2 pr-0.5 py-2 rounded-[50%]">
                      JP
                    </div>
                    <div className="text-zinc-700 text-xs font-medium self-center grow whitespace-nowrap my-auto">
                      ↓
                    </div>
                  </div>
                </div>
                <div className="self-stretch flex justify-between gap-1 items-start">
                  <div className="bg-white flex grow basis-[0%] flex-col items-stretch pt-3.5 pb-2 px-1.5 rounded-md">
                    <div className="flex justify-between gap-1.5 items-start">
                      <div className="text-black text-xs font-medium whitespace-nowrap">
                        ✐
                      </div>
                      <div className="text-black text-xs font-medium self-stretch whitespace-nowrap">
                        View feedback
                      </div>
                    </div>
                    <div className="flex items-stretch justify-between gap-1.5 mt-2.5 max-md:justify-center">
                      <div className="text-black text-xs font-medium whitespace-nowrap self-start">
                        ⚐{" "}
                      </div>
                      <div className="text-black text-xs font-medium">
                        View feature requests
                      </div>
                      <div className="text-black text-xs font-medium whitespace-nowrap mt-1.5 self-start">
                        ⌅
                      </div>
                    </div>
                  </div>
                  <div className="bg-white flex grow basis-[0%] flex-col items-stretch pt-3.5 pb-1.5 px-1.5 rounded-md">
                    <div className="flex justify-between gap-1.5 items-start">
                      <div className="text-black text-xs font-medium whitespace-nowrap">
                        ☻
                      </div>
                      <div className="text-black text-xs font-medium self-stretch whitespace-nowrap">
                        My profile
                      </div>
                    </div>
                    <div className="flex justify-between gap-1 mt-2 items-start">
                      <div className="flex basis-[0%] flex-col items-center">
                        <img
                          loading="lazy"
                          srcSet="..."
                          className="aspect-square object-contain object-center w-[7px] overflow-hidden"
                        />
                        <img
                          loading="lazy"
                          srcSet="..."
                          className="aspect-[1.17] object-contain object-center w-[7px] overflow-hidden mt-2"
                        />
                      </div>
                      <div className="self-stretch flex grow basis-[0%] flex-col items-end">
                        <div className="text-black text-xs font-medium self-stretch whitespace-nowrap">
                          Add a teammate
                        </div>
                        <div className="text-black text-xs font-medium self-stretch whitespace-nowrap mt-2">
                          Log out
                        </div>
                        <div className="text-black text-xs font-medium whitespace-nowrap">
                          ⌅
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch mt-3.5 max-md:max-w-full max-md:pr-5">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[78%] max-md:w-full max-md:ml-0">
              <div className="flex flex-col items-stretch max-md:max-w-full max-md:mt-7">
                <div className="max-md:max-w-full max-md:pr-5">
                  <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                    <div className="flex flex-col items-stretch w-3/12 max-md:w-full max-md:ml-0">
                      <div className="shadow-sm bg-white flex grow flex-col w-full pt-8 pb-5 px-11 rounded-3xl max-md:mt-4 max-md:px-5">
                        <div className="text-black text-center text-2xl font-semibold tracking-tighter">
                          15{" "}
                        </div>
                        <div className="text-zinc-700 text-center text-xs font-semibold self-center mt-4">
                          Total Clients
                        </div>
                        <div className="text-black text-center text-xs font-semibold whitespace-nowrap bg-green-300 self-center aspect-[3.8125] justify-center items-stretch mt-3.5 pl-2.5 pr-4 py-1.5 rounded-3xl">
                          + 200%
                        </div>
                        <div className="text-zinc-500 text-center text-xs font-semibold self-stretch mt-2">
                          From 50,000 (last 4 weeks)
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="bg-white flex grow flex-col items-center w-full pt-8 pb-5 px-12 rounded-3xl max-md:mt-4 max-md:px-5">
                        <div className="text-black text-center text-2xl font-semibold tracking-tighter">
                          3
                        </div>
                        <div className="text-zinc-700 text-center text-xs font-semibold self-stretch whitespace-nowrap mt-4">
                          Inactive Clients
                        </div>
                        <div className="text-black text-center text-xs font-semibold bg-green-300 aspect-[3.8125] justify-center items-stretch mt-3.5 px-4 py-1.5 rounded-3xl">
                          - 20%
                        </div>
                        <div className="text-zinc-500 text-center text-xs font-semibold self-stretch mt-2">
                          From $10 (last 4 weeks)
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="shadow-sm bg-white flex grow flex-col items-center w-full pl-12 pr-11 pt-8 pb-5 rounded-3xl max-md:mt-4 max-md:px-5">
                        <div className="text-black text-center text-2xl font-semibold tracking-tighter">
                          9
                        </div>
                        <div className="text-zinc-700 text-center text-xs font-semibold self-stretch whitespace-nowrap mt-4">
                          Active Campaigns
                        </div>
                        <div className="text-black text-center text-xs font-semibold whitespace-nowrap bg-green-300 aspect-[3.8125] justify-center items-stretch mt-3 pl-2.5 pr-4 py-1.5 rounded-3xl">
                          + 300%
                        </div>
                        <div className="text-zinc-500 text-center text-xs font-semibold self-stretch mt-2">
                          From 1,000 (last 4 weeks)
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="shadow-sm bg-white flex grow flex-col items-center w-full pt-8 pb-5 px-10 rounded-3xl max-md:mt-4 max-md:px-5">
                        <div className="text-black text-center text-2xl font-semibold tracking-tighter">
                          7
                        </div>
                        <div className="text-zinc-700 text-center text-xs font-semibold self-stretch mt-4">
                          Drafted Campaigns
                        </div>
                        <div className="text-black text-center text-xs font-semibold whitespace-nowrap bg-green-300 aspect-[3.8125] justify-center items-stretch mt-3 pl-2.5 pr-4 py-1.5 rounded-3xl">
                          + 200%
                        </div>
                        <div className="text-zinc-500 text-center text-xs font-semibold self-stretch whitespace-nowrap mt-1.5">
                          From $12,000 (last 4 weeks)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3.5 max-md:max-w-full max-md:pr-5">
                  <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                    <div className="flex flex-col items-stretch w-3/12 max-md:w-full max-md:ml-0">
                      <div className="shadow-sm bg-white flex grow flex-col items-stretch w-full px-12 py-6 rounded-3xl max-md:mt-5 max-md:px-5">
                        <div className="text-black text-center text-2xl font-semibold tracking-tighter whitespace-nowrap">
                          $24,000
                        </div>
                        <div className="text-zinc-700 text-center text-xs font-semibold self-center whitespace-nowrap mt-3">
                          Total Revenue
                        </div>
                        <div className="text-black text-center text-xs font-semibold bg-green-300 self-center aspect-[3.8125] justify-center items-stretch mt-3.5 px-4 py-1.5 rounded-3xl">
                          - 20%
                        </div>
                        <div className="text-zinc-500 text-center text-xs font-semibold mt-2">
                          From $10 (last 4 weeks)
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="shadow-sm bg-white flex grow flex-col items-stretch w-full px-12 py-6 rounded-3xl max-md:mt-5 max-md:px-5">
                        <div className="text-black text-center text-2xl font-semibold tracking-tighter whitespace-nowrap">
                          $12,000
                        </div>
                        <div className="text-zinc-700 text-center text-xs font-semibold self-center mt-3">
                          Total Spend
                        </div>
                        <div className="text-black text-center text-xs font-semibold bg-green-300 self-center aspect-[3.8125] justify-center items-stretch mt-3 px-4 py-1.5 rounded-3xl">
                          - 20%
                        </div>
                        <div className="text-zinc-500 text-center text-xs font-semibold mt-2">
                          From $10 (last 4 weeks)
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="shadow-sm bg-white flex grow flex-col items-stretch w-full px-12 py-6 rounded-3xl max-md:mt-5 max-md:px-5">
                        <div className="text-black text-center text-2xl font-semibold tracking-tighter whitespace-nowrap">
                          $12,000
                        </div>
                        <div className="text-zinc-700 text-center text-xs font-semibold self-center mt-3">
                          Total Profit
                        </div>
                        <div className="text-black text-center text-xs font-semibold bg-green-300 self-center aspect-[3.8125] justify-center items-stretch mt-3.5 px-4 py-1.5 rounded-3xl">
                          - 20%
                        </div>
                        <div className="text-zinc-500 text-center text-xs font-semibold mt-2">
                          From $10 (last 4 weeks)
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-stretch w-3/12 ml-5 max-md:w-full max-md:ml-0">
                      <div className="shadow-sm bg-white flex grow flex-col w-full px-12 py-6 rounded-3xl max-md:mt-5 max-md:px-5">
                        <div className="text-black text-center text-2xl font-semibold tracking-tighter self-stretch">
                          $5,000
                        </div>
                        <div className="text-zinc-700 text-center text-xs font-semibold self-stretch whitespace-nowrap mt-3">
                          Unpaid Invoices
                        </div>
                        <div className="text-black text-center text-xs font-semibold bg-green-300 self-center aspect-[3.8125] justify-center items-stretch mt-3 px-4 py-1.5 rounded-3xl">
                          - 20%
                        </div>
                        <div className="text-zinc-500 text-center text-xs font-semibold self-stretch mt-2">
                          From $10 (last 4 weeks)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[22%] ml-5 max-md:w-full max-md:ml-0">
              <div className="border shadow-lg bg-white flex w-full grow flex-col items-stretch mx-auto pb-5 rounded-2xl border-solid border-zinc-500 border-opacity-10 max-md:mt-7">
                <div className="bg-green-300 flex flex-col items-stretch pl-3 pr-20 py-6 rounded-2xl max-md:pr-5">
                  <div className="text-black text-base font-semibold max-md:mr-1">
                    Quick Actions:
                  </div>
                  <div className="text-neutral-600 text-xs font-semibold mt-2.5 max-md:mr-1">
                    Let’s get you where you need to go
                  </div>
                </div>
                <div className="flex items-stretch gap-1.5 ml-3 mt-3.5 self-start max-md:ml-2.5">
                  <div className="flex basis-[0%] flex-col items-center max-md:hidden">
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/099d209f337e69956dd52d7215a15ea38d8f064dc469c38b0ae1f58a5d0a5a1c?"
                      className="aspect-[1.08] object-contain object-center w-3.5 overflow-hidden"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/099d209f337e69956dd52d7215a15ea38d8f064dc469c38b0ae1f58a5d0a5a1c?"
                      className="aspect-[1.08] object-contain object-center w-3.5 overflow-hidden mt-6"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/099d209f337e69956dd52d7215a15ea38d8f064dc469c38b0ae1f58a5d0a5a1c?"
                      className="aspect-[1.08] object-contain object-center w-3.5 overflow-hidden mt-5"
                    />
                    <img
                      loading="lazy"
                      src="https://cdn.builder.io/api/v1/image/assets/TEMP/b24dba76cdf8a69f0b02c0989e6ddea951c584b5910fc8f07c5e72f8a096b6dd?"
                      className="aspect-[0.17] object-contain object-center w-3.5 overflow-hidden mt-5"
                    />
                  </div>
                  <div className="text-black text-sm font-medium">
                    Manage Clients
                    <br />
                    <br />
                    Manage Campaigns
                    <br />
                    <br />
                    View Reports
                    <br />
                    <br />
                    View Billing
                    <br />
                    <br />
                    Train Ava
                    <br />
                    <br />
                    Feedback form
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="self-stretch mt-1.5 max-md:max-w-full max-md:pr-5">
          <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
            <div className="flex flex-col items-stretch w-[76%] max-md:w-full max-md:ml-0">
              <div className="shadow-sm bg-white grow w-full pl-3 pr-16 py-6 rounded-xl max-md:max-w-full max-md:mt-7 max-md:pr-5">
                <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
                  <div className="flex flex-col items-stretch w-[55%] max-md:w-full max-md:ml-0">
                    <div className="flex flex-col max-md:mt-10">
                      <div className="self-stretch flex flex-col items-stretch pl-5">
                        <div className="text-black text-xl font-semibold tracking-tight whitespace-nowrap">
                          All Campaigns
                        </div>
                        <div className="text-zinc-700 text-sm mt-2.5">
                          Let’s see how the campaigns are performing
                        </div>
                      </div>
                      <div className="text-zinc-700 text-center text-xs font-semibold tracking-tight self-stretch whitespace-nowrap mt-16 max-md:mt-10">
                        100,000
                      </div>
                      <div className="text-zinc-700 text-center text-xs font-semibold tracking-tight self-stretch whitespace-nowrap mt-12 max-md:mt-10">
                        50,000
                      </div>
                      <div className="text-black text-center text-xs font-semibold whitespace-nowrap ml-7 mt-20 self-start max-md:ml-2.5 max-md:mt-10">
                        10/15/2023
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch w-[27%] ml-5 max-md:w-full max-md:ml-0">
                    <div className="flex flex-col items-stretch mt-32 max-md:mt-10">
                      <div className="border bg-neutral-100 flex flex-col items-stretch pl-1.5 pr-4 py-1.5 border-solid border-zinc-300">
                        <div className="text-black text-xs font-semibold whitespace-nowrap">
                          20,000 Impressions
                        </div>
                        <div className="text-zinc-500 text-xs font-semibold whitespace-nowrap mt-1.5">
                          500 clicks
                        </div>
                        <div className="text-zinc-500 text-xs font-semibold whitespace-nowrap mt-2.5">
                          11/1/2023
                        </div>
                      </div>
                      <img
                        loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/47c15c65aa43d303a0a44ee535e1c1de7a65ef680e66ad984b913f8f7bc97d0d?"
                        className="aspect-[0.11] object-contain object-center w-2 stroke-[1px] stroke-green-300 overflow-hidden self-center max-w-full"
                      />
                      <div className="self-center flex w-1 shrink-0 h-1 flex-col rounded-[50%]" />
                    </div>
                  </div>
                  <div className="flex flex-col items-stretch w-[18%] ml-5 max-md:w-full max-md:ml-0">
                    <div className="flex flex-col mt-14 items-end max-md:mt-10">
                      <div className="text-black text-xs font-semibold self-stretch whitespace-nowrap">
                        Total Impressions
                      </div>
                      <div className="text-zinc-500 text-xs font-semibold self-stretch whitespace-nowrap mt-4">
                        Total Clicks
                      </div>
                      <div className="text-black text-center text-xs font-semibold whitespace-nowrap mt-44 max-md:mt-10">
                        11/15/2023
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-stretch w-[24%] ml-5 max-md:w-full max-md:ml-0">
              <div className="border shadow-lg bg-white flex w-full flex-col items-stretch mt-5 mx-auto pb-7 rounded-2xl border-solid border-zinc-500 border-opacity-10 max-md:mt-10">
                <div className="bg-green-300 flex flex-col pl-4 pr-20 py-3.5 rounded-2xl items-start max-md:pr-5">
                  <div className="text-black text-base font-semibold">
                    Resources
                  </div>
                  <div className="text-neutral-600 text-xs font-semibold mt-2.5">
                    We are always here for you
                  </div>
                </div>
                <div className="flex items-stretch gap-1.5 ml-5 mt-4 self-start max-md:ml-2.5">
                  <img
                    loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/253d2b673f9ddaf180aeda64c7c402e6106c5317d5317947ac31392fb8b325b3?"
                    className="aspect-[0.34] object-contain object-center w-4 overflow-hidden shrink-0 max-w-full"
                  />
                  <div className="text-black text-sm font-medium">
                    Stripe
                    <br />
                    <br />
                    Notion
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          loading="lazy"
          srcSet="..."
          className="aspect-[1.7] object-contain object-center w-[312px] overflow-hidden max-w-full mt-11 self-end max-md:mt-10"
        />
      </div>
    </div>
  );
};

export default Admin;