import React from "react";
import { motion } from "framer-motion";

const LoadingPage: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center bg-black z-[150]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 border-4 border-t-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <motion.span
          className="text-xl font-medium text-gray-200"
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          Loading, please wait...
        </motion.span>
      </div>
    </motion.div>
  );
};

export default LoadingPage;
