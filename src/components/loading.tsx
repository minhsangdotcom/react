import { motion } from "framer-motion";

export function Loading() {
  return (
    <motion.div
      className="fixed inset-0 z-[150] flex items-center justify-center bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.4 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />

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
}
