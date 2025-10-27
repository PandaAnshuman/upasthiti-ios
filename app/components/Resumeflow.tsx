"use client"

import Link from "next/link"

export function Resumeflow() {
    return (
        <Link href="https://dashboard.resumeflow.pro/" target="_blank">
            <div className="w-full min-h-48 bg-gradient-to-br mt-5 from-[#00fff2] via-[#043634] to-[#000000] rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 relative group">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute inset-0 overflow-hidden rounded-xl">
                    <div className="absolute inset-0 animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <div className="relative h-full flex flex-col p-6 text-primary-foreground">
                    <div>
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold">ResumeFlow.pro</h2>
                            <span className="inline-block text-xs font-bold tracking-widest uppercase opacity-90 mb-2 bg-white/20 px-3 py-1 rounded-full">
                                FREE
                            </span>
                        </div>
                        <span>Transform your <span className="font-bold text-[#ffcc00]">resume</span> into <span className="font-bold text-[#00fff2]">success</span></span>
                    </div>
                    <div className="flex text-xs flex-col text-center mt-5 gap-2 bg-black/20 p-4 rounded-xl">
                        <h2 className="capitalize">Let our AI work for you, so that you can achieve your goals!</h2>
                    </div>
                    {/* Top section */}
                    {/* <div>
                    <span className="inline-block text-xs font-bold tracking-widest uppercase opacity-90 mb-2 bg-white/20 px-3 py-1 rounded-full">
                        25%
                    </span>
                    <h2 className="text-5xl font-black leading-tight text-balance">Save 40%</h2>
                </div> */}

                    {/* Bottom section */}
                    {/* <div className="flex items-end justify-between gap-3">
                    <div>
                        <p className="text-sm font-semibold opacity-95">Premium Plans</p>
                        <p className="text-xs opacity-75">Ends in 48 hours</p>
                    </div>
                    <button className="bg-white text-primary font-bold py-2 px-4 rounded-xl hover:bg-opacity-90 transition-all duration-200 flex items-center gap-2 group/btn shadow-lg hover:shadow-xl">
                        <span className="text-sm">Claim</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div> */}
                </div>
            </div>
        </Link>

    )
}
