"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as yup from "yup";
import { setCookie } from "cookies-next";
import {
  User,
  Lock,
  Mail,
  BookOpen,
  Users,
  Hash,
  Zap,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import pb from "@/utils/pocketbase";
import { updateProfile } from "@/redux/features/profile-slice";
import { AppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import CryptoJS from "crypto-js";

const RegistrationPage = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const shouldReduceMotion = useReducedMotion();

  const [authType, setAuthType] = useState<"REGISTER" | "LOGIN">("REGISTER");
  const [formData, setFormData] = useState({
    name: "",
    branch: "",
    section: "",
    password: "",
    email: "",
    registration_no: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const todaysDate = new Date().toLocaleDateString();
  // console.log(todaysDate);

  function encryptData(data: any) {
    const encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      "i0pERnlYwn"
    ).toString();
    return encrypted;
  }

  function decryptData(encryptedData: string) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, "i0pERnlYwn");
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decrypted;
  }

  function getExpiryDateForMonths(months: number) {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date;

  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider: "google" });

      if (authData?.record?.id) {
        const token = authData.token;
        setCookie("token", token, {
          expires: getExpiryDateForMonths(5),
        });

        dispatch(
          updateProfile({
            id: authData.record.id,
            name: authData.record.name,
            email: authData.record.email,
            registration_no: authData.record.registration_no || "",
            section: authData.record.section || "",
            branch: authData.record.branch || "",
            token: token,
          })
        );

        toast.success("Signed in with Google successfully!");
        router.replace("/");
      }
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const branches = [
    "CSE",
    "CSE-AI/ML",
    "CSE-DataScience",
    "CSE-CyberSecurity",
    "CSE-IoT",
    "CSIT",
    "ECE",
    "BCA",
    "MCA",
    "EEE",
    "EE",
    "CE",
    "ME",
  ];

  const sections = [
    "E1A2",
    "E1B1",
    "E1B2",
    "E1B3",
    "E1C1",
    "E1C2",
    "E1C3",
    "E1D1",
    "E1D2",
    "E1E1",
    "E1E2",
    "E1F1",
    "E1F2",
    "E1F3",
    "E1G1",
    "E1G2",
    "E1G3",
    "E1H1",
    "E1H2",
    "E1I1",
    "E1I2",
    "E1J1",
    "E1J2",
    "E1J3",
    "E1K1",
    "E1K2",
    "E1K3",
    "E1L1",
    "E1L2",
    "E1M1",
    "E1N3",
    "E1Q2",
    "E1M2",
    "E1N1",
    "E1N2",
    "E1O1",
    "E1O2",
    "E1O3",
    "E1P1",
    "E1P2",
    "E1Q1",
    "E1R1",
    "E1R2",
    "E1R3",
    "E1S1",
    "E1S2",
    "E1V1",
    "E1A1",
    "E1U2",
    "E1V2",
    "E1S3",
    "E1T1",
    "E1T2",
    "E1U1",
    "C1A1",
    "C1A2",
    "C2A1",
    "C2A2",
    "C2B1",
    "C2B2",
  ];

  const validationSchema = yup.object({
    name: yup
      .string()
      .test("name-required", "Full name is required", (value) =>
        authType === "REGISTER" ? !!value : true
      ),
    email: yup
      .string()
      .email("Invalid email address")
      .required("Email is required")
      .test("not-phone", "Please enter a valid email address.", (value) => {
        if (!value) return true;
        // reject values that are phone-number-like (only digits, optional plus, length 7-15)
        return !/^\+?\d{7,15}$/.test(value);
      }),
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
      .min(5, "Registration number must be of 5 characters."),
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
      // Section is reset only if the branch changes
      ...(name === "branch" ? { section: "" } : {}),
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await validationSchema.validate(formData, { abortEarly: false });

      const data = {
        ...formData,
        passwordConfirm: formData.password,
      };

      const record = await pb.collection("users").create(data);
      if (record?.id) {
        handlelogin();
      }
    } catch (error: any) {
      if (error instanceof yup.ValidationError) {
        // Loop through all validation errors and show them
        error.inner.forEach((err) => {
          toast.error(err.message || "Validation failed");
        });
      } else if (error.response?.data) {
        toast.error(
          error.response.message || "Failed to create a record."
        );
      } else {
        // console.log(error.response.message);
        toast.error(error.response.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlelogin = async () => {
    setLoading(true);
    try {
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify({
        identity: formData.registration_no,
        password: formData.password,
      });

      const respone = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/collections/users/auth-with-password/new`,
        {
          method: "POST",
          body: bodyContent,
          headers: headersList,
        }
      );

      const data = await respone.json();
      if (respone.status === 200) {
        const token = data.token;
        if (token) {
          setCookie("token", token, {
            expires: getExpiryDateForMonths(5),
          });

          dispatch(
            updateProfile({
              id: data.record.id,
              name: data.record.name,
              email: data.record.email,
              registration_no: data.record.registration_no,
              section: data.record.section,
              branch: data.record.branch,
              token: token,
            })
          );
          if (authType === "LOGIN") {
            toast.success("Logged in successfully.");
            router.replace("/");
          } else {
            toast.success("You are ready to go!");
            router.replace("/privacy");
          }
        }
        // console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      // console.log(error);
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };
  const availableSections = sections;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-4 sm:p-6 md:p-8 flex flex-col items-center justify-between relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full transform rotate-45"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-400/20 to-red-400/20 rounded-full transform -rotate-45"></div>
      </div>
      <div className="flex flex-col items-center space-y-4">
        <header className="relative z-10 w-full max-w-4xl mx-auto text-center mb-10">
          <motion.h1
            initial={shouldReduceMotion ? {} : { opacity: 0, y: -20 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl font-bold text-gray-800 dark:text-white mb-2"
          >
            Upasthiti
          </motion.h1>
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.9 }}
            animate={shouldReduceMotion ? {} : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="flex items-center justify-center gap-2 text-xl text-gray-600 dark:text-gray-300"
          >
            <span>Attendance Made Easy</span>
            <Zap className="w-6 h-6 text-yellow-400" />
          </motion.div>
        </header>

        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <div className="mb-8 flex justify-center space-x-4">
              <button
                onClick={() => setAuthType("REGISTER")}
                disabled={loading}
                className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${authType === "REGISTER"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading && authType === "REGISTER" ? (
                  <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                ) : (
                  "Register"
                )}
              </button>
              <button
                onClick={() => setAuthType("LOGIN")}
                disabled={loading}
                className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${authType === "LOGIN"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {loading && authType === "LOGIN" ? (
                  <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                ) : (
                  "Login"
                )}
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={authType}
                initial={
                  shouldReduceMotion
                    ? {}
                    : { opacity: 0, x: authType === "REGISTER" ? 20 : -20 }
                }
                animate={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
                exit={
                  shouldReduceMotion
                    ? {}
                    : { opacity: 0, x: authType === "REGISTER" ? -20 : 20 }
                }
                transition={{ duration: 0.2 }}
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
                      placeholder="Select Your Section"
                      disabled={!formData.branch}
                    />
                    <InputField
                      icon={Hash}
                      name="registration_no"
                      type={formData.branch}
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
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  togglePasswordVisibility={togglePasswordVisibility}
                  showPassword={showPassword}
                />

                <button
                  type="button"
                  onClick={() => {
                    if (authType === "REGISTER") {
                      handleSubmit();
                    } else {
                      handlelogin();
                    }
                  }}
                  disabled={loading}
                  className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out ${loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                >
                  {loading ? (
                    <Loader2 className="animate-spin w-5 h-5 mx-auto" />
                  ) : authType === "REGISTER" ? (
                    "Register"
                  ) : (
                    "Login"
                  )}
                </button>
                {authType === "LOGIN" && (
                  <>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                          Or
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                      className={`w-full py-3 px-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center justify-center gap-2 ${loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                      <img
                        src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
                        alt="Google G Logo"
                        className="w-5 h-5"
                      />
                      Continue with Google
                    </button>
                  </>
                )}
              </motion.form>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
      {/* Footer */}
      <div className=" w-full text-center p-4 text-gray-600 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">Devverse</span>
        </p>
        <span className="font-semibold">
          <a href="/issue-solve">Unban or Solve your issue</a>
        </span>
      </div>
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
  togglePasswordVisibility?: () => void;
  showPassword?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  icon: Icon,
  togglePasswordVisibility,
  showPassword,
  ...props
}) => (
  <div className="relative">
    <Icon
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      size={18}
    />
    <input
      {...props}
      className="w-full pl-10 pr-12 py-3 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-800 dark:text-white transition duration-200"
    />
    {props.name === "password" && togglePasswordVisibility && (
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 focus:outline-none"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    )}
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

// interface AuthTypeButtonProps {
//   type: "REGISTER" | "LOGIN";
//   currentType: "REGISTER" | "LOGIN";
//   onClick: () => void;
//   loading: boolean;
// }

// const AuthTypeButton: React.FC<AuthTypeButtonProps> = ({
//   type,
//   currentType,
//   onClick,
//   loading,
// }) => {
//   const shouldReduceMotion = useReducedMotion();
//   return (
//     <motion.button
//       whileHover={shouldReduceMotion || loading ? {} : { scale: 1.05 }}
//       whileTap={shouldReduceMotion || loading ? {} : { scale: 0.95 }}
//       onClick={loading ? undefined : onClick} // Disable click if loading
//       className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
//         currentType === type
//           ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md"
//           : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
//       } ${loading ? "opacity-50 cursor-not-allowed" : ""}`} // Add styles for disabled state
//       disabled={loading} // Disable button when loading
//     >
//       {loading && currentType === type ? (
//         <Loader2 className="animate-spin w-5 h-5 mx-auto" />
//       ) : type === "REGISTER" ? (
//         "Register"
//       ) : (
//         "Login"
//       )}
//     </motion.button>
//   );
// };

export default RegistrationPage;
