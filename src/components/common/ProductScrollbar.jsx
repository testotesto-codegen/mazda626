
import { useEffect, useRef, useState } from 'react';
import Research from '../../assets/backgrounds/Accelno_AIResearch.mp4';
import Valuation from '../../assets/backgrounds/Accelno_Valuation.mp4';
import Screening from '../../assets/backgrounds/Accelno_Screening.mp4';
import { motion, AnimatePresence } from "framer-motion";

const scrollOptions = [
    {
        name: "Valuation",
        video: Valuation,
        id: 0
    },
    {
        name: "Ai Research",
        video: Research,
        id: 1
    },
    {
        name: "Screening",
        video: Screening,
        id: 2
    }
]

const ProductScrollbar = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY; // current scroll position
            const triggerPoint = 784; // change this to your desired scroll position
            const triggerPoint2 = 1300;
            const triggerPoint3 = 1900;
            
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
        <div className="w-full flex justify-center mt-[200px] mb-20 min-h-[2200px]">
            <div className="text-white w-[90%] flex justify-center">
                <div className="w-4/5 rounded-xl">
                    <div className="p-4 flex sticky top-20">
                        <AnimatePresence mode="wait">
                            <motion.video
                                key={scrollOptions[activeIndex].id}
                                autoPlay
                                loop
                                muted
                                className=" rounded-lg"
                                initial={{ y: 100, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -100, opacity: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <source src={scrollOptions[activeIndex].video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </motion.video>
                        </AnimatePresence>
                    </div>
                </div>
                <div className="w-1/5 relative">
                    <div className="flex flex-col gap-20 ml-6 mb-10 h-min sticky top-20">
                        {scrollOptions.map((option, idx) => {
                            return (<button
                                key={option.id}
                                className={`text-xl font-semibold transition-all transition-300 ${
                                    activeIndex === idx ? 'border-l-2 border-purple-500 text-white' : 'text-white/60'
                                }`}
                            >
                                {option.name}
                            </button>)}
                        )}
                    </div>
                </div>
            </div>
        </div>
        
    )
}


export default ProductScrollbar;