import { FC } from "react";
import { Link } from 'react-router-dom';

import Mark from '../assets/logo/logo.png';

const Login: FC = () => {
    return (
        <div className="flex flex-col items-center justify-center py-9 bg-[#fafafc] min-h-[100vh]">
            <div className="shadow-lg shadow-[#0a0a0a]/[.04] w-[450px] sm:w-[630px] bg-[white] rounded-[15px]">
                <div className="flex flex-col items-center justify-center p-7 border-b-[1px] border-[#ededed]">
                    <img src={Mark} alt="mark" className="w-[50px]" />
                    <p className="font-[Inter] text-2xl mt-3 font-bold">Sign In</p>
                </div>
                
                <form className="text-left p-8">
                    <div>
                        <label className="font-[Inter] block text-md font-semibold my-1">Email</label>
                        <input type="email" className="w-full border-indigo-500 border-[1px] my-1 rounded-[10px] px-4 py-2" />
                    </div>
                    <div>
                        <label className="font-[Inter] block text-md font-semibold my-1">Password</label>
                        <input type="password" className="w-full border-indigo-500 border-[1px] my-1 rounded-[10px] px-4 py-2" />
                    </div>
                    <button className="rounded-[10px] bg-[#212121] w-full py-2 my-4 text-[white]">Sign In</button>

                    <Link className="block text-center mt-5 text-[#6c63ff]" to="/">Sign Up</Link>
                </form>
            </div>
        </div>
    );
};

export default Login;