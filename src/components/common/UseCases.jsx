import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion";

const UseCases = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const useCases = [
        {
            title: "Private Equity",
            description: "At Accelno, our objective is clear: to accelerate financial workflows. We are developing a platform designed to streamline financial modeling and analysis, beginning with our advanced LBO tool. Whether you're evaluating a new investment or conducting diligence, our tools are built to help you move with greater speed and confidence. Get started below or explore the future of private market analysis."
        },
        {
            title: "Investment Banking",
            description: "Accelno is redefining the pace of financial analysis. Our platform is purpose-built to enhance the efficiency of modeling and transaction execution, starting with our intelligent DCF tool. From pitch to close, we equip bankers with faster, smarter tools that support client-ready deliverables. Begin below or discover how modern dealmaking is evolving."
        },
        {
            title: "Hedge Funds",
            description: "In today's fast-moving markets, speed and precision are critical. Accelno enables hedge fund analysts to accelerate their research and valuation workflows, starting with our high-performance DCF tool. Whether you're identifying opportunities or updating portfolio models, our platform delivers the agility and depth you need. Get started below or explore the future of investment analysis."
        }
    ]

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY; // current scroll position
            const triggerPoint = 3400; // change this to your desired scroll position
            const triggerPoint2 = 3800;
            const triggerPoint3 = 4600;
            
            if (scrollY > triggerPoint && scrollY < triggerPoint2) {
                setActiveIndex(0);
            } else if (scrollY > triggerPoint2 && scrollY < triggerPoint3) {
                setActiveIndex(1);
            } else if (scrollY > triggerPoint3) {
                setActiveIndex(2);
            }
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);

    return (
        <div className="w-full flex justify-center mt-40 mb-[450px] bg-[#121416] p-8 bg-opacity-[70%] min-h-[2600px]">
            <div className="w-[90%] flex">
                <div className="w-1/2 p-4 relative">
                    <div className="sticky top-20">
                        <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-white mb-6">
                            Use Cases
                        </div>
                        <div className="mb-20 text-[#8E8E8E]">
                            Our goal is simple - to make finance faster. We are building a platform that speeds up financial modeling & analysis, starting with our DCF tool. Get started below, or see what the future of financial analysis looks like first.
                        </div>
                        <div>
                            <button 
                                type="button"
                                className="text-white bg-[#813CF0] rounded-lg py-2 px-10 mt-4 transition-all duration-150 hover:brightness-[130%]">
                                Roadmap
                            </button>
                        </div>
                    </div>
                    
                </div>
                <div className="w-1/2 relative">
                    <div className="sticky top-20">
                        <AnimatePresence mode="wait">
                            <motion.div
                            key={activeIndex}
                            className="w-[80%]"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.4 }}>
                                <div className="flex flex-col items-center w-full border-[1px] border-[#813CF0] bg-[#1E2124] p-4 mb-10 rounded-lg">
                                    <div className=" w-[80%]">
                                        <div className="text-center text-white text-3xl mb-6 mt-4">
                                            {useCases[activeIndex].title}
                                        </div>
                                        <div className="text-[#8E8E8E] mb-16">
                                            {useCases[activeIndex].description}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>      
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UseCases;