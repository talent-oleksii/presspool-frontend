import { FC } from "react";
import Mark from "../../../../src/assets/logo/logo.png";

const FinalStepForm: FC<{ handleFinalSubmit: () => void }> = (props) => {
  return (
    <div className="max-w-[570px] m-auto flex flex-col gap-8">
      {/* Page Title  */}
      <div className="flex flex-col items-center">
        <img src={Mark} alt="mark" className="w-8" />
        <span className="text-black text-[30px] -tracking-[0.9px] font-bold leading-normal">
          Terms & Conditions
        </span>
        <span className="text-[18px] font-normal -tracking-[0.54px] mt-2">
          Please review and accept the terms of our platform to complete your
          sign up process.
        </span>
      </div>
      {/* Page Content */}
      <div className="rounded-[8px] border border-solid border-black h-[540px] text-left">
        <div className="max-h-[520px] overflow-y-auto p-[10px] max-w-4xl mx-auto rounded-lg text-left">
          <h1 className="text-2xl font-bold mb-4">
            Terms & Conditions Agreement for Creator Partners
          </h1>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Introduction</h2>
            <p>
              Welcome to Presspool.ai. By using our platform, you agree to these
              terms, which are designed to ensure a trustworthy and secure
              environment for all users.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              1. Confidentiality Agreement
            </h2>
            <ul className="list-disc pl-5">
              <li>
                As a creator partner, you may have access to confidential client
                data, which is protected under this Non-Disclosure Agreement
                (NDA).
              </li>
              <li>
                You agree to use this data solely for the purpose of fulfilling
                your obligations as a partner and not for any other purpose.
              </li>
              <li>
                You must not disclose this data to any third party, nor reach
                out to our clients for direct partnerships, without our express
                written consent.
              </li>
              <li>
                You acknowledge that all client data is the exclusive property
                of Presspool.ai, and you agree to protect it with the utmost
                care.
              </li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              2. Use of the Platform
            </h2>
            <ul className="list-disc pl-5">
              <li>
                You must use Presspool.ai in accordance with our policies and
                procedures, and for lawful purposes only.
              </li>
              <li>
                You agree not to use the platform in a way that could damage our
                reputation or the functionality of the platform.
              </li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              3. Termination and Consequences of Breach
            </h2>
            <ul className="list-disc pl-5">
              <li>
                We reserve the right to terminate your access to the platform
                for violation of these terms.
              </li>
              <li>
                Breach of confidentiality obligations may result in legal action
                to protect the interests of Presspool.ai and our clients.
              </li>
            </ul>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">4. Acknowledgment</h2>
            <p>
              By logging into our platform, you acknowledge that you have read
              and agreed to these terms.
            </p>
          </section>

          <section className="mb-4">
            <h2 className="text-xl font-semibold mb-2">5. Amendments</h2>
            <p>
              We reserve the right to amend these terms at any time, with the
              updated terms taking effect upon posting.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
            <p>
              For any questions regarding these terms, please contact us at{" "}
              <a
                href="mailto:admin@presspool.ai"
                className="text-blue-600 hover:underline"
              >
                admin@presspool.ai
              </a>
              .
            </p>
          </section>
        </div>
      </div>
      {/* Continue Button  */}
      <button
        className="rounded-[6px] bg-main w-full h-[52px] text-base font-semibold"
        onClick={props.handleFinalSubmit}
      >
        I AGREE AND ACCEPT THE TERMS
      </button>
    </div>
  );
};

export default FinalStepForm;
