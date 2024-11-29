import Link from "next/link";
import React from "react";

const Page = () => {
  return (
    <div>
      <div className="pb-3 px-5">
        <div className=" text-xl font-[700]">
          Privacy Policy for "Upasthiti" App:
        </div>
        <div className=" pb-3">
          We are committed to ensuring the privacy and security of the
          information collected through our Student Check-In Application. This
          Privacy Policy outlines how we collect, use, disclose, and safeguard
          the personal information provided by users of the application. By
          using the application, you consent to the practices described in this
          Privacy Policy.
        </div>
        <div className=" text-xl font-[700] ">1. Information We Collect:</div>
        <div className=" space-y-2">
          <div className="w-full ">- Name(in encryption format)</div>
          <div className="w-full ">- Registration Number</div>
          <div className="w-full ">- HasToken (to verify check-in status)</div>
          <div className="w-full ">- groups</div>
          <div className="w-full ">- Branch</div>
          <div className="w-full ">- Section</div>
          <div className="w-full ">- Last Login On</div>
          <div className="w-full ">
            - iOS Browser ID(to prevent multi-device login)
          </div>
        </div>
        <div className=" text-xl font-[700] pt-3">
          2. Use of Collected Information:
        </div>
        <div className=" flex items-center space-y-2">
          <div className="w-full ">
            - The collected information is used solely for the purpose of
            student check-in and attendance management.
          </div>
          <div className="w-full ">
            - The data is used to verify student identity, track attendance, and
            generate relevant reports for educational purposes.
          </div>
        </div>
        <div className=" text-xl font-[700] pt-3">3. Data Security:</div>
        <div className="space-y-2">
          <div className="w-full ">
            - We implement appropriate security measures to protect the
            collected data against unauthorized access, alteration, disclosure,
            or destruction.
          </div>
          <div className="w-full ">
            - Access to collected data is restricted to authorized personnel
            only.
          </div>
        </div>
        <div className=" text-xl font-[700] pt-3">4. Data Retention:</div>
        <div className="space-y-2">
          <div className="w-full ">
            - We retain the collected data for as long as necessary to fulfill
            the purposes outlined in this Privacy Policy.
          </div>
        </div>

        <div className=" text-xl font-[700] pt-3">5. User Rights:</div>
        <div className="space-y-2">
          <div className="w-full ">
            - Users have the right to access their personal information.
          </div>
          <div className="w-full ">
            - Users can contact the admin for any inquiries or requests related
            to their data.
          </div>
        </div>
        <div className=" text-xl font-[700] pt-3">
          6. Changes to Privacy Policy:
        </div>
        <div className="space-y-2">
          <div className="w-full ">
            - We reserve the right to modify this Privacy Policy at any time.
            Changes will be effective upon posting the updated policy within the
            application.
          </div>
        </div>
        <div className="w-full  py-3 font-[800]">
          By using "Upasthiti," you acknowledge that you have reviewed,
          understood, and agreed to this Privacy Policy.
        </div>
        <Link
          href="/"
          className="inline-flex justify-center items-center w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold active:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
          Continue
        </Link>
      </div>
    </div>
  );
};

export default Page;
