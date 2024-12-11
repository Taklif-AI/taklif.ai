"use client";

import { create } from 'zustand';

interface AssignmentData {
  file: File | string | null;
  interests: string;
}

interface AssignmentStore {
  assignmentData: AssignmentData;
  setAssignmentData: (data: AssignmentData) => void;
}

export const useAssignmentStore = create<AssignmentStore>((set) => ({
  assignmentData: {
    file: null,
    interests:  "",
  },
  setAssignmentData: (data) => set({ assignmentData: data }),
}));