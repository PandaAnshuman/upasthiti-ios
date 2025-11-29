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
    "2C3",
    "2A1",
    "2H1",
    "2H2",
    "2G3",
    "2O3",
    "202",
    "2M1",
    "2N2",
    "2N3",
    "2P1",
    "2P2",
    "2O9",
    "2I1",
    "2I2",
    "3D1",
    "3D2",
    "3B1",
    "3A1",
    "3B2",
    "3A2",
    "2H3",
    "2I3",
    "2B2",
    "2K3",
    "2C1",
    "2K2",
    "2M2",
    "2N1",
    "2O2",
    "2D1",
    "2E1",
    "2E2",
    "2B1",
    "2F1",
    "2F2",
    "2F3",
    "2G2",
    "3C1",
    "3C2",
    "3H1",
    "2L1",
    "2J1",
    "2J3",
    "2M3",
    "2K1",
    "2L3",
    "2A2",
    "2C2",
    "2O1",
    "2J2",
    "2D2",
    "2L2",
    "2G1",
    "2B3",
    "3G1",
    "3H2",
    "C2A1",
    "C2A2",
    "4B1",
    "4A2",
    "C2B1",
    "C2B2",
    "24C1A1",
    "24C1A2",
    "4A1",
    "7A1",
    "4C1",
    "4C2",
    "1A1",
    "4B2",
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
          error.response.data.message || "Failed to create a record."
        );
      } else {
        toast.error("An unexpected error occurred.");
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
                className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
                  authType === "REGISTER"
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
                className={`px-6 py-2 rounded-full text-sm font-medium transition duration-300 ${
                  authType === "LOGIN"
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
                  className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 transition duration-300 ease-in-out ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
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
                      className={`w-full py-3 px-4 bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white font-semibold rounded-lg shadow-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out flex items-center justify-center gap-2 ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <span className="w-5 h-5 inline-block">
                        <svg
                          viewBox="0 0 48 48"
                          className="w-full h-full"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden
                        >
                          <path
                            fill="#EA4335"
                            d="M24 9.5c3.5 0 5.9 1.5 7.3 2.8l5.4-5.3C33.5 4 28.9 2.5 24 2.5 14.9 2.5 7.7 8.8 4.6 17.1l6.5 5.1C12.9 16 18 9.5 24 9.5z"
                          />
                          <path
                            fill="#34A853"
                            d="M46.5 24c0-1.6-.1-2.8-.4-4H24v8h12.7c-.5 3-2.4 5.5-5.2 7.2l5.1 4c4.7-4.3 7.9-10.8 7.9-15.2z"
                          />
                          <path
                            fill="#4A90E2"
                            d="M10.1 27.7A14.9 14.9 0 0 1 9 24c0-1.3.2-2.6.6-3.7l-6.5-5.1C1.4 16.9 0 20.3 0 24c0 3.7 1.4 7 3.6 9.5l6.5-5.8z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M24 46.5c4.9 0 9-1.6 12.2-4.3l-5.9-4.5C29.4 38.5 26.8 39.3 24 39.3c-6 0-11.1-6.5-13-15.6l-6.5 5.1C7.7 39.7 14.9 46.5 24 46.5z"
                          />
                        </svg>
                      </span>
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
