"use client"

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react"
import { Check, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface PromotionModalProps {
    isOpen: boolean
    onClose: () => void
}

export function PromotionModal({ isOpen, onClose }: PromotionModalProps) {
    const [timeLeft, setTimeLeft] = useState(7)

    useEffect(() => {
        if (!isOpen) {
            setTimeLeft(7)
            return
        }

        if (timeLeft <= 0) {
            onClose()
            return
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, isOpen, onClose])

    const progressPercentage = (timeLeft / 5) * 100

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="sm" backdrop="blur" className="max-w-sm">
            <ModalContent className="bg-gradient-to-br from-[#00fff2] via-[#043634] to-[#000000] rounded-3xl border border-border/50">
                <ModalHeader className="relative bg-gradient-to-br from-primary via-primary/90 to-accent p-8 text-primary-foreground overflow-hidden rounded-t-3xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                    <div className="relative w-full">
                        <div className="flex items-center gap-2 mb-3">
                            <Zap className="w-5 h-5" />
                            <span className="text-xs font-bold tracking-widest uppercase opacity-90">Exclusive Deal</span>
                        </div>
                        <h2 className="text-2xl">Resumeflow.pro</h2>
                        <h2 className="text-sm font-light">Create your first professional portfolio now!</h2>
                    </div>
                </ModalHeader>
                <ModalBody className="p-8 space-y-6">
                    <div className="space-y-4">
                        <p className="text-foreground/80 text-sm leading-relaxed font-medium">
                            Transform your resume into premium protfolio webiste in minutes.
                        </p>

                        <ul className="space-y-3">
                            {["Land More Interviews", "Win Freelance Clients", "Build Your Personal Brand", "Save Dozens of Hours"].map(
                                (feature, index) => (
                                    <li key={index} className="flex items-center gap-3 text-sm text-foreground/75">
                                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-3 h-3 text-primary font-bold" />
                                        </div>
                                        <span className="font-medium">{feature}</span>
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>

                </ModalBody>

                <ModalFooter className="flex flex-col gap-3 p-8 pt-0">
                    <Button
                        fullWidth
                        className="bg-gradient-to-r from-primary to-accent text-primary-foreground font-bold py-3 rounded-xl hover:shadow-lg transition-all duration-200"
                        size="lg"
                        onPress={() => { window.open("https://dashboard.resumeflow.pro", "_blank") }}
                    >
                        Claim Now
                    </Button>

                    <Button
                        fullWidth
                        variant="light"
                        className="text-xs font-medium text-foreground/50 hover:text-foreground/70 transition-colors py-2 hover:bg-muted/30 rounded-lg"
                        onPress={onClose}
                    >
                        Dismiss
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
