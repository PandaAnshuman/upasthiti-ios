"use client";
import pb from "@/utils/pocketbase";
import { Link, User, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as yup from "yup";
const RegistrationPage = () => {
  const [AuthType, setAuthType] = useState<"REGISTER" | "LOGIN">("REGISTER");
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    section: "",
    password: "",
    email: "",
    registration_no: "",
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

  const validationSchema = yup.object({
    name: yup
      .string()
      .test("name-required", "Full name is required", (value) =>
        AuthType === "REGISTER" ? !!value : true
      ),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    branch: yup
      .string()
      .test("branch-required", "Branch is required", (value) =>
        AuthType === "REGISTER" ? !!value : true
      ),
    section: yup
      .string()
      .test("section-required", "Section is required", (value) =>
        AuthType === "REGISTER" ? !!value : true
      ),
    registration_no: yup
      .string()
      .test("reg-no-required", "Registration number is required", (value) =>
        AuthType === "REGISTER" ? !!value : true
      )
      .min(10, "Registration number must be 10 digits")
      .matches(/^\d+$/, "Only numeric values are allowed"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

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

  const handleSubmit = async () => {
    try {
      // Validate form data against the schema
      const validityResponse = await validationSchema.validate(formData, {
        abortEarly: false,
      });
      console.log(
        AuthType === "REGISTER" ? "Registration Data:" : "Login Data:",
        validityResponse
      );

      const data = {
        password: formData.password,
        passwordConfirm: formData.password,
        email: formData.email,
        name: formData.name,
        registration_no: formData.registration_no,
        section: formData.section,
        branch: formData.branch,
      };

      const record = await pb.collection("users").create(data);
      console.log(record);

      console.log("You are ready to go.");
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        // Optionally map errors to display in the UI

        if (error.inner.length > 0) {
          toast.error(error.inner[0].message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        // const validationErrors = error.inner.reduce((acc, err) => {
        //   //@ts-ignore
        //   acc[err.path] = err.message;
        //   return acc;
        // }, {});
        // console.log("Mapped Errors:", validationErrors);
      } else {
        console.error("Unexpected Error:", error);
      }
    }

    // try {

    //   const record = await pb.collection("users").create(data);
    //   console.log(record);
    // } catch (error) {
    //   console.error(error);
    // }
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

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="space-y-6 h-[600px] overflow-scroll"
          >
            {AuthType === "REGISTER" && (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-lg font-semibold mb-2 text-gray-800"
                  >
                    Full Name
                  </label>
                  <div className="flex items-center border rounded-lg border-gray-300 bg-gray-50">
                    <User className="mx-2 text-gray-600" />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="w-full py-3 px-4 text-lg bg-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-lg font-semibold mb-2 text-gray-800"
                  >
                    Email
                  </label>
                  <div className="flex items-center border rounded-lg border-gray-300 bg-gray-50">
                    <Mail className="mx-2 text-gray-600" />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      required
                      className="w-full py-3 px-4 text-lg bg-transparent"
                    />
                  </div>
                </div>

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

                <div>
                  <label
                    htmlFor="registration_no"
                    className="block text-lg font-semibold mb-2 text-gray-800"
                  >
                    Registration Number
                  </label>
                  <div className="flex items-center border rounded-lg border-gray-300 bg-gray-50">
                    <Link className="mx-2 text-gray-600" />
                    <input
                      type="text"
                      id="registration_no"
                      name="registration_no"
                      value={formData.registration_no}
                      onChange={handleInputChange}
                      placeholder="Enter your registration number"
                      required
                      className="w-full py-3 px-4 text-lg bg-transparent"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-semibold mb-2 text-gray-800"
              >
                Password
              </label>
              <div className="flex items-center border rounded-lg border-gray-300 bg-gray-50">
                <Lock className="mx-2 text-gray-600" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  className="w-full py-3 px-4 text-lg bg-transparent"
                />
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full py-3 px-6 text-lg font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                {AuthType === "REGISTER" ? "Register" : "Login"}
              </button>
            </div>
          </form>

          <div className="text-center mt-4">
            <p>
              {AuthType === "REGISTER"
                ? "Already have an account?"
                : "Don’t have an account?"}
              <button
                onClick={() =>
                  setAuthType(AuthType === "REGISTER" ? "LOGIN" : "REGISTER")
                }
                className="text-blue-500 underline ml-2"
              >
                {AuthType === "REGISTER" ? "Login" : "Register"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
