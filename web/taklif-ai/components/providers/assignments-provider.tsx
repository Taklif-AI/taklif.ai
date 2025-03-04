"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { getAssignmentsCount } from "@/actions/get-assignments-count";
import { useCurrentUser } from "@/hooks/use-current-user";

const AssignmentsContext = createContext({ count: 0, refreshCount: () => {} });

export function AssignmentsProvider({ children }) {
  const [count, setCount] = useState(0);
  const user = useCurrentUser();

  const fetchCount = async () => {
    if (!user?.id) return;
    const newCount = await getAssignmentsCount(user.id);
    setCount(newCount.length);
  };

  useEffect(() => {
    fetchCount();
  }, [user]);

  return (
    <AssignmentsContext.Provider value={{ count, refreshCount: fetchCount }}>
      {children}
    </AssignmentsContext.Provider>
  );
}

export const useAssignments = () => useContext(AssignmentsContext);
