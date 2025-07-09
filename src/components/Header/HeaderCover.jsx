import dashboardCover from '../../assets/backgrounds/cover-db.png';
import { motion } from 'framer-motion';

const HeaderCover = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 100 }}
			whileInView={{ opacity: 1, y: 0 }}
			transition={{ ease: 'easeOut', duration: 2 }}
			viewport={{ once: true }}
			className="mt-40 lg:mt-56 z-20"
		>
			<img src={dashboardCover} alt="" className=" mx-auto z-20" />
		</motion.div>
	);
};

export default HeaderCover;
