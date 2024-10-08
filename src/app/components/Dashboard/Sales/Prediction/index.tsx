"use client";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";

const Prediction = () => {
  const queryClient = useQueryClient();
  const { isPending, error, data } = useQuery({
    queryKey: ["prediction"],
    queryFn: async () => {
      const response = await fetch(`/api/prediction`);
      const data = await response.json();
      return data;
    },
  });

  if (error) {
    return (
      <div className="flex flex-row justify-around items-center">
        <h2>Error Loading Prediction</h2>
        <Button
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["prediction"] })
          }
          variant="outline"
          className="border-secondary"
        >
          <h3 className="text-2xl">↻</h3>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col">
      <AnimatePresence mode="wait">
        {isPending && (
          <motion.div
            className="flex flex-col w-full justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <LoadingSpinner className="text-secondary" />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        {data && (
          <motion.div
            className="w-full flex-row justify-around items-center p-4"
            initial={{ opacity: 0, display: "none" }}
            animate={{ opacity: 1, display: "flex" }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1.0 }}
          >
            <div className="p-2 border-r border-secondary">
              <h1>Projected Sales</h1>
            </div>
            <div className="p-2 text-left text-green-600">
              <p>
                <span className="text-secondary">AM:</span> $
                {Math.floor(data.morningPrediction)}
              </p>
              <p>
                <span className="text-secondary">PM:</span> $
                {Math.floor(data.nightPrediction)}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prediction;
