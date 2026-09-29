"use client";
import { motion } from "framer-motion";
import { Zap, CheckCircle } from "lucide-react";
const page = () => {
  const profileSections = [
    {
      title: "Lead & Mentor",
      profiles: [
        {
          name: "DR. ANUKAMPA BEHERA",
          role: "Assistant Professor at ITER, SOA University | DevOps, AI and ML Researcher",
          photo: "/images/maam2.png",
          link: "https://www.linkedin.com/in/dr-anukampa-behera-a1393849/",
        },
      ],
    },
    {
      title: "Management & Development",
      profiles: [
        {
          name: "PAWAN KUMAR",
          role: "Ex-FTC Intern@Fidelity International | Flutter App Developer | Solving for India Regional Qualified | HackOn with Amazon'22",
          photo: "/images/pawanbhai.png",
          link: "https://www.linkedin.com/in/pawan-k-9490581b5/",
        },
        {
          name: "SANAT SHIKHAR SINHA",
          role: "MERN | Full stack Developer | Machine Learning Engineer | E-Cell SOA President",
          photo: "/images/Sanat.png",
          link: "https://www.linkedin.com/in/sanatsinhaa/",
        },
      ],
    },
    {
      title: "Core Developers",
      profiles: [
        {
          name: "ANSHUMAN PANDA",
          role: "Full stack Developer | Machine Learning Engineer | Upcoming SWE Intern @JP Morgan Chase & Co.",
          photo: "/images/anshu.png",
          link: "https://www.linkedin.com/in/anshuman-panda-575562258/",
        },
        {
          name: "SUBHRANSHU CHOUDHURY",
          role: "MERN | Ethical Hacker & Cyber Expert | Native and Web3 Developer | YouTuber | Fullstack Developer @Timepay.ai",
          photo: "/images/shub.png",
          link: "https://www.linkedin.com/in/subhranshusekharchoudhury/",
        },
        {
          name: "CHINMAYA SA",
          role: "Fullstack, App, Blockchain Developer | YouTuber | Frontend and Blockchain Developer at Neobase FZ. Co. | Upcoming SWE Intern @Cisco",
          photo: "/images/chinmayasa.png",
          link: "https://www.linkedin.com/in/chinmaya-sa-60a594239/",
        },
        {
          name: "SOHAIL KHAN",
          role: "MERN | Ethical Hacker & Bug Bounty Hunter",
          photo: "/images/sohail.png",
          link: "https://www.linkedin.com/in/sohail-khan-coder/",
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 p-6 flex flex-col items-center justify-between relative overflow-hidden">
      {/* Header */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full transform rotate-45 animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-yellow-400/20 to-red-400/20 rounded-full transform -rotate-45 animate-pulse"></div>
        <div className=" p-4">
          <header className="flex justify-center items-center mb-8">
            <motion.div
              className="flex items-center gap-2 bg-white/10 rounded-full px-6 py-3 text-xl"
              whileHover={{ scale: 1.05 }}
            >
              <span>About Us</span>
              <Zap className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </header>
        </div>
      </div>
      <div className="mt-20">
        {/* Profile Sections */}
        {profileSections.map((section) => (
          <motion.section
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-2"
          >
            <motion.h2 className="text-3xl font-bold  mb-2 flex items-center gap-2">
              {section.title}
              <span className="bg-yellow-400 p-1 rounded-md">
                <CheckCircle className="w-6 h-6 text-[#0a0a29]" />
              </span>
            </motion.h2>
            <div className="space-y-6">
              {section.profiles.map((profile) => (
                <motion.div
                  key={profile.name}
                  className="bg-white rounded-lg p-4 text-black shadow-md hover:shadow-lg transition-shadow"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative w-20 h-20 flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={profile.photo}
                        alt={`${profile.name}'s profile`}
                        className="rounded-full w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-0 hover:opacity-30 rounded-full transition-opacity duration-300" />
                    </motion.div>

                    <div className="flex-grow">
                      <h3 className="font-bold text-lg mb-1">{profile.name}</h3>
                      <p className="text-gray-700 text-sm mb-2">
                        {profile.role}
                      </p>

                      <motion.a
                        target="_blank"
                        href={profile.link}
                        className="text-purple-600 font-medium text-sm hover:text-purple-800 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Know More
                      </motion.a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
      <div className=" w-full text-center p-4 text-gray-600 dark:text-gray-400">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="font-semibold">Devverse</span>
        </p>
      </div>
    </div>
  );
};

export default page;
