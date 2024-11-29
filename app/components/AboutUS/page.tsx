"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import { Avatar } from "@nextui-org/react";
import { Card } from "@nextui-org/react";
import { ChevronLeft } from "lucide-react";
import React from "react";

interface TeamMember {
  id: string;
  name: string;
  title: string;
  description: string;
  image: string;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Lead & Mentor",
    title:
      "Assistant Professor at ITER, SOA University | DevOps, AI and ML Researcher",
    description:
      "As an accomplished trainer and a dedicated researcher in the domains of DevOps, AI, and ML, I am driven by a passion for pushing the boundaries of knowledge. With over 19 years of experience in academia.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "2",
    name: "Product Manager",
    title: "Ex-FTC Intern@Fidelity International | Flutter App Developer",
    description:
      "Hi there, I'm a flutter app developer, and I make stuff that no one uses except of course semester app",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: "3",
    name: "Core Developers",
    title: "Fullstack, App, Blockchain Developer | YouTuber",
    description:
      "Frontend and Blockchain Developer at Neobase FZ. Co. | Upcoming SWE Intern @Cisco",
    image: "/placeholder.svg?height=200&width=200",
  },
];

export default function TeamProfile() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMember, setSelectedMember] = React.useState<TeamMember | null>(
    null
  );

  const handleOpen = (member: TeamMember) => {
    setSelectedMember(member);
    onOpen();
  };

  return (
    <div className="min-h-screen bg-[#0a0a29] text-white p-4">
      <div className="space-y-8">
        {teamMembers.map((member) => (
          <div key={member.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold">{member.name}</h2>
              <span className="text-yellow-400 text-2xl">⚡</span>
            </div>

            <Card
              className="bg-white p-4 rounded-xl"
              isPressable
              onPress={() => handleOpen(member)}
            >
              <div className="flex gap-4">
                <Avatar
                  src={member.image}
                  className="w-20 h-20"
                  alt={member.name}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-black">
                    {member.name}
                  </h3>
                  <p className="text-gray-600 text-sm">{member.title}</p>
                  <Button
                    className="mt-2 text-blue-600 p-0 h-auto bg-transparent hover:bg-transparent"
                    variant="light"
                    onPress={() => handleOpen(member)}
                  >
                    Know More
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedMember?.name}
              </ModalHeader>
              <ModalBody>
                <div className="flex gap-4">
                  <Avatar
                    src={selectedMember?.image}
                    className="w-24 h-24"
                    alt={selectedMember?.name || "Team member"}
                  />
                  <div>
                    <h3 className="text-lg font-semibold">
                      {selectedMember?.title}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {selectedMember?.description}
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
