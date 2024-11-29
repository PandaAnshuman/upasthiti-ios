"use client";
import { Link } from "lucide-react";
import React, { useState } from "react";

const RegistrationPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    section: "",
    password: "",
  });

  const branches = [
    "CSE",
    "CSIT",
    "ECE",
    "BCA",
    "MCA",
    "EEE",
    "EE",
    "CE",
    "ME",
  ];

  const sectionDetails = [
    {
      branch: "CSE",
      sections: [
        1, 2, 3, 4, 6, 7, 8, 9, 11, 12, 13, 14, 16, 17, 18, 19, 21, 22, 23, 24,
        26, 27, 28, 29, 31, 32, 33, 34, 36, 37, 38, 39, 41, 42, 43, 44, 45, 51,
      ],
    },
    {
      branch: "CSIT",
      sections: [5, 10, 15, 20, 25, 30],
    },
    {
      branch: "ECE",
      sections: [35, 40, 46],
    },
    {
      branch: "BCA",
      sections: ["R1", "R2"],
    },
    {
      branch: "MCA",
      sections: ["A1", "C1", "D1", "D", "E", "F", "C2"],
    },
    {
      branch: "EEE",
      sections: [49],
    },
    {
      branch: "EE",
      sections: [48],
    },
    {
      branch: "CE",
      sections: [47],
    },
    {
      branch: "ME",
      sections: [50],
    },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    // Update branch and reset section if branch changes
    if (name === "branch") {
      setFormData((prevState) => ({
        ...prevState,
        branch: value,
        section: "", // Reset section on branch change
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Registration Data:", formData);
  };

  // Get sections for selected branch
  const getSectionsForBranch = (branch: string) => {
    const branchDetail = sectionDetails.find(
      (detail) => detail.branch === branch
    );
    return branchDetail ? branchDetail.sections : [];
  };

  const availableSections = getSectionsForBranch(formData.branch);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col sm:bg-white bg-[url('/cover-img.jpg')] bg-cover bg-center">
      {/* Main content */}
      <div className="flex-grow flex items-center justify-center px-4 pt-8">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-lg p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-bold mb-8 text-center">Upashtiti IO</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-semibold mb-2 text-gray-800"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                required
                className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-gray-50 text-lg"
              />
            </div>

            {/* Branch Dropdown */}
            <div>
              <label
                htmlFor="branch"
                className="block text-lg font-semibold mb-2 text-gray-800"
              >
                Branch
              </label>
              <select
                id="branch"
                name="branch"
                value={formData.branch}
                onChange={handleInputChange}
                required
                className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-gray-50 text-lg appearance-none"
              >
                <option value="">Select Your Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
            </div>

            {/* Section Dropdown */}
            <div>
              <label
                htmlFor="section"
                className="block text-lg font-semibold mb-2 text-gray-800"
              >
                Section
              </label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                required
                disabled={!formData.branch} // Disable until a branch is selected
                className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-gray-50 text-lg appearance-none"
              >
                <option value="">
                  {formData.branch
                    ? "Select Your Section"
                    : "Select a Branch First"}
                </option>
                {availableSections.map((section) => (
                  <option key={section} value={section}>
                    {section}
                  </option>
                ))}
              </select>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="password"
                className="block text-lg font-semibold mb-2 text-gray-800"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a strong password"
                required
                className="w-full py-3 px-4 rounded-lg border border-gray-300 bg-gray-50 text-lg"
              />
            </div>

            {/* Submit Button */}
            <a
              href="/privacy"
              className="inline-flex justify-center items-center w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold active:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
            >
              Continue
            </a>
          </form>
        </div>
      </div>

      {/* iOS-style home indicator */}
      <div className="h-[34px] flex justify-center items-end pb-2">
        <div className="w-[134px] h-[5px] bg-black rounded-full opacity-40"></div>
      </div>
    </div>
  );
};

export default RegistrationPage;
