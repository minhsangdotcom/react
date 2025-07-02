import React from 'react';
import { motion } from 'framer-motion';

const LoadingPage: React.FC = () => {
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 border-4 border-t-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <motion.span
          className="text-xl font-medium text-gray-700 dark:text-gray-200"
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
