import { motion } from 'framer-motion';

const CategoryLabel = ({ name }) => {
  return (
    <motion.div 
      className="flex items-center mb-4"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.h2 
        className="category-label py-1 px-3"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        {name}
      </motion.h2>
      <motion.div 
        className="ml-3 h-0.5 flex-grow bg-harbor/10 dark:bg-skyblue/10 rounded"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      />
    </motion.div>
  );
};

export default CategoryLabel; 