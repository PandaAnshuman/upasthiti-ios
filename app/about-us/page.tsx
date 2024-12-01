// "use client";
// import React, { useState } from "react";
// import { ChevronLeft } from "lucide-react";

// interface TeamMember {
//   id: string;
//   name: string;
//   title: string;
//   description: string;
//   image: string;
//   link: string;
// }

// const teamMembers: TeamMember[] = [
//   {
//     id: "1",
//     name: "Lead & Mentor",
//     title:
//       "Assistant Professor at ITER, SOA University | DevOps, AI and ML Researcher",
//     description:
//       "As an accomplished trainer and a dedicated researcher in the domains of DevOps, AI, and ML, I am driven by a passion for pushing the boundaries of knowledge. With over 19 years of experience in academia.",
//     image: "/placeholder.svg?height=200&width=200",
//     link: "https://example.com",
//   },
//   {
//     id: "2",
//     name: "Product Manager",
//     title: "Ex-FTC Intern@Fidelity International | Flutter App Developer",
//     description:
//       "Hi there, I'm a flutter app developer, and I make stuff that no one uses except of course semester app",
//     image: "/placeholder.svg?height=200&width=200",
//     link: "https://example.com",
//   },
//   {
//     id: "3",
//     name: "Core Developers",
//     title: "Fullstack, App, Blockchain Developer | YouTuber",
//     description:
//       "Frontend and Blockchain Developer at Neobase FZ. Co. | Upcoming SWE Intern @Cisco",
//     image: "/placeholder.svg?height=200&width=200",
//     link: "https://example.com",
//   },
// ];

// export default function TeamProfilePage() {
//   const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

//   return (
//     <div className="bg-gradient-to-b from-blue-500 to-purple-600 min-h-screen py-12 px-4">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center gap-4 mb-8">
//           <button
//             onClick={() => window.history.back()}
//             className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
//           >
//             <ChevronLeft size={24} />
//           </button>
//           <h1 className="text-3xl font-bold text-white">Meet the Team</h1>
//         </div>

//         {/* Team Members Grid */}
//         <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
//           {teamMembers.map((member) => (
//             <div
//               key={member.id}
//               className="flex bg-white rounded-lg shadow-md overflow-hidden transform transition-transform hover:scale-105"
//               onClick={() => setSelectedMember(member)}
//             >
//               <img
//                 src={member.image}
//                 alt={member.name}
//                 className="w-24 h-24 object-cover m-4 rounded-full"
//               />
//               <div className="flex flex-col justify-between p-4">
//                 <div>
//                   <h2 className="text-lg font-bold text-gray-800">
//                     {member.name}
//                   </h2>
//                   <p className="text-sm text-gray-600 mb-2">{member.title}</p>
//                 </div>
//                 <button className="text-blue-600 text-sm hover:underline">
//                   Know More
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Selected Member Details */}
//         {selectedMember && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
//             <div className="bg-white rounded-2xl max-w-md w-full p-8 relative">
//               <button
//                 onClick={() => setSelectedMember(null)}
//                 className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//               >
//                 <ChevronLeft size={24} />
//               </button>
//               <img
//                 src={selectedMember.image}
//                 alt={selectedMember.name}
//                 className="w-32 h-32 mx-auto mb-6 rounded-full object-cover"
//               />
//               <h2 className="text-2xl font-bold text-center mb-2">
//                 {selectedMember.name}
//               </h2>
//               <p className="text-gray-600 text-center">
//                 {selectedMember.description}
//               </p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React from "react";

const page = () => {
  return <div></div>;
};

export default page;
