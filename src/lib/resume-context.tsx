"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

const STORAGE_KEY = "job-intel-resume";

interface ResumeContextValue {
  resumeText: string;
  setResumeText: (text: string) => void;
  clearResume: () => void;
  hasSavedResume: boolean;
}

const ResumeContext = createContext<ResumeContextValue | null>(null);

/**
 * ResumeProvider is a context provider that stores the resume text in local storage.
 * It accepts children as a prop and renders the children inside a ResumeContext.Provider.
 * It uses the useState hook to store the resume text in state.
 * It uses the useEffect hook to set the resume text in state when the component mounts and when the state changes.
 * It defines a setResumeText function that updates the resume text in state and local storage.
 * It defines a clearResume function that clears the resume text in state and local storage.
 * It returns the children inside a ResumeContext.Provider if the resume text is not hydrated.
 * It renders the children inside a ResumeContext.Provider if the resume text is hydrated with a value that is not an empty string.
 * It provides three values to the children: resumeText, setResumeText, clearResume, and hasSavedResume.
 */
export function ResumeProvider({ children }: { children: React.ReactNode }) {
  const [resumeText, setResumeTextState] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setResumeTextState(stored);
    setHydrated(true);
  }, []);

  const setResumeText = useCallback((text: string) => {
    setResumeTextState(text);
    if (text) {
      localStorage.setItem(STORAGE_KEY, text);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const clearResume = useCallback(() => {
    setResumeTextState("");
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  if (!hydrated)
    return (
      <ResumeContext.Provider
        value={{
          resumeText: "",
          setResumeText: () => {},
          clearResume: () => {},
          hasSavedResume: false,
        }}>
        {children}
      </ResumeContext.Provider>
    );

  return (
    <ResumeContext.Provider
      value={{
        resumeText,
        setResumeText,
        clearResume,
        hasSavedResume: resumeText.length > 0,
      }}>
      {children}
    </ResumeContext.Provider>
  );
}

/**
 * useResume is a hook that provides the resume text and functions to set and clear the resume text.
 * It returns the resume text, setResumeText, clearResume, and hasSavedResume.
 * It throws an error if used outside of ResumeProvider.
 */
export function useResume() {
  const ctx = useContext(ResumeContext);
  if (!ctx) throw new Error("useResume must be used within ResumeProvider");
  return ctx;
}
