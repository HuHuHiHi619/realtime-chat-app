import { motion } from "framer-motion";

interface AnimatedViewProps {
  children: React.ReactNode;
  viewKey: string;
}

function AnimatedView({ children, viewKey }: AnimatedViewProps) {
  return (
    <motion.div
      key={viewKey}
      initial={{ scale: 0.95, opacity: 0, filter: "blur(10px)" }}
      animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
      exit={{ scale: 1.05, opacity: 0, filter: "blur(5px)" }}
      transition={{
        duration: 0.25,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedView;
