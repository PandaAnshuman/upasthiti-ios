"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { setCookie } from "cookies-next";
import { User, Lock, Mail, BookOpen, Users, Hash, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import pb from "@/utils/pocketbase";
import DeviceFingerprint from "../components/DeviceFingerprint";
import { updateProfile } from "@/redux/features/profile-slice";
import { AppDispatch } from "@/redux/store";

const RegistrationPage = () => {
  const [authType, setAuthType] = useState<"REGISTER" | "LOGIN">("REGISTER");
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    section: "",
    password: "",
    email: "",
    registration_no: "",
  });
  const [vid, setvid] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

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
    { branch: "CSIT", sections: [5, 10, 15, 20, 25, 30] },
    { branch: "ECE", sections: [35, 40, 46] },
    { branch: "BCA", sections: ["R1", "R2"] },
    { branch: "MCA", sections: ["A1", "A2", "B1", "B2", "C1"] },
    { branch: "EEE", sections: [49] },
    { branch: "EE", sections: [48] },
    { branch: "CE", sections: [47] },
    { branch: "ME", sections: [50] },
  ];

  const handleVisitorId = (id: string) => {
    if (!vid) {
      setvid(id);
      console.log("Captured Visitor ID:", id);
    }
  };

  const validationSchema = yup.object({
    name: yup
      .string()
      .test("name-required", "Full name is required", (value) =>
        authType === "REGISTER" ? !!value : true
      ),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required"),
    branch: yup
      .string()
      .test("branch-required", "Branch is required", (value) =>
        authType === "REGISTER" ? !!value : true
      ),
    section: yup
      .string()
      .test("section-required", "Section is required", (value) =>
        authType === "REGISTER" ? !!value : true
      ),
    registration_no: yup
      .string()
      .test("reg-no-required", "Registration number is required", (value) =>
        authType === "REGISTER" ? !!value : true
      )
      .min(10, "Registration number must be 10 digits"),
    password: yup
      .string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters"),
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
      ...(name === "branch" ? { section: "" } : {}),
    }));
  };

  const handleLogin = async () => {
    try {
      const loginData = await pb
        .collection("users")
        .authWithPassword(formData.registration_no, formData.password);
      if (loginData.token) {
        setCookie("token", loginData.token, {
          maxAge: 60 * 60 * 24 * 30.44 * 7,
        });
        console.log("Logged in successfully:", loginData.token);
        dispatch(
          updateProfile({
            id: loginData.record.id,
            name: loginData.record.name,
            email: loginData.record.email,
            registration_no: loginData.record.registration_no,
            section: loginData.record.section,
            branch: loginData.record.branch,
            token: loginData.token,
          })
        );
        toast.success("Logged in successfully.");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  const handleSubmit = async () => {
    try {
      if (!vid) {
        toast.error("Visitor ID not captured yet. Please refresh the page.");
        return;
      }

      await validationSchema.validate(formData, { abortEarly: false });

      const data = {
        ...formData,
        passwordConfirm: formData.password,
        visitor_id: vid,
      };

      const record = await pb.collection("users").create(data);
      if (record?.id) {
        const authData = await pb
          .collection("users")
          .authWithPassword(formData.registration_no, formData.password);

        if (authData.token) {
          dispatch(
            updateProfile({
              id: record.id,
              name: record.name,
              email: record.email,
              registration_no: record.registration_no,
              section: record.section,
              branch: record.branch,
              token: authData.token,
            })
          );
          setCookie("token", authData.token, {
            maxAge: 60 * 60 * 24 * 30.44 * 7,
          });
        }
      }

      toast.success("You are ready to go.");
      window.location.href = "/privacy";
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        toast.error(error.inner[0]?.message || "Validation failed");
      } else if (error.response?.data) {
        toast.error(
          error.response.data.message || "Failed to create a record."
        );
      } else {
        console.error("Unexpected Error:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const getSectionsForBranch = (branch: string) => {
    const branchDetail = sectionDetails.find(
      (detail) => detail.branch === branch
    );
    return branchDetail ? branchDetail.sections : [];
  };

  const availableSections = getSectionsForBranch(formData.branch);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full transform rotate-45 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-400/20 to-red-400/20 rounded-full transform -rotate-45 animate-pulse"></div>
      </div>

      <header className="relative z-10 w-full max-w-4xl mx-auto text-center mb-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold text-gray-800 dark:text-white mb-2"
        >
          Upashtiti iOS
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center justify-center gap-2 text-xl text-gray-600 dark:text-gray-300"
        >
          <span>Attendance Made Easy</span>
          <Zap className="w-6 h-6 text-yellow-400" />
        </motion.div>
      </header>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <div className="mb-8 flex justify-center space-x-4">
            <AuthTypeButton
              type="REGISTER"
              currentType={authType}
              onClick={() => setAuthType("REGISTER")}
            />
            <AuthTypeButton
              type="LOGIN"
              currentType={authType}
              onClick={() => setAuthType("LOGIN")}
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={authType}
              initial={{ opacity: 0, x: authType === "REGISTER" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: authType === "REGISTER" ? -20 : 20 }}
              transition={{ duration: 0.3 }}
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="space-y-6"
            >
              {authType === "REGISTER" && (
                <>
                  <InputField
                    icon={User}
                    name="name"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                  <InputField
                    icon={Mail}
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                  <SelectField
                    icon={BookOpen}
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    required
                    options={branches}
                    placeholder="Select Your Branch"
                  />
                  <SelectField
                    icon={Users}
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    required
                    options={availableSections}
                    placeholder={
                      formData.branch
                        ? "Select Your Section"
                        : "Select a Branch First"
                    }
                    disabled={!formData.branch}
                  />
                  <InputField
                    icon={Hash}
                    name="registration_no"
                    type={formData.branch === "MCA" ? "text" : "number"}
                    placeholder="Enter your registration number"
                    value={formData.registration_no}
                    onChange={handleInputChange}
                    required
                  />
                </>
              )}
              {authType === "LOGIN" && (
                <InputField
                  icon={Hash}
                  name="registration_no"
                  type="text"
                  placeholder="Enter your Registration Number"
                  value={formData.registration_no}
                  onChange={handleInputChange}
                  required
                />
              )}
              <InputField
                icon={Lock}
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={authType === "REGISTER" ? handleSubmit : handleLogin}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out"
              >
                {authType === "REGISTER" ? "Register" : "Login"}
              </motion.button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>

      <DeviceFingerprint onVisitorIdCaptured={handleVisitorId} />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 text-sm text-center text-gray-500 dark:text-gray-400"
      >
        Visitor ID: {vid}
      </motion.p>
    </div>
  );
};

interface InputFieldProps {
  icon: React.ElementType;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      size={18}
    />
    <input
      {...props}
      className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white transition duration-200"
    />
  </div>
);

interface SelectFieldProps {
  icon: React.ElementType;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  required?: boolean;
  options: (string | number)[];
  placeholder: string;
  disabled?: boolean;
}

const SelectField: React.FC<SelectFieldProps> = ({
  icon: Icon,
  options,
  placeholder,
  ...props
}) => (
  <div className="relative">
    <Icon
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      size={18}
    />
    <select
      {...props}
      className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white appearance-none transition duration-200"
    >
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

interface AuthTypeButtonProps {
  type: "REGISTER" | "LOGIN";
  currentType: "REGISTER" | "LOGIN";
  onClick: () => void;
}

const AuthTypeButton: React.FC<AuthTypeButtonProps> = ({
  type,
  currentType,
  onClick,
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
      currentType === type
        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
        : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
    }`}
  >
    {type === "REGISTER" ? "Register" : "Login"}
  </motion.button>
);

export default RegistrationPage;

