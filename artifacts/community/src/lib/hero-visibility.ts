import { createContext, useContext } from "react";

interface HeroVisibilityContextValue {
  /** null = hero not yet measured on this page */
  heroVisible: boolean | null;
  setHeroVisible: (visible: boolean | null) => void;
}

export const HeroVisibilityContext = createContext<HeroVisibilityContextValue>({
  heroVisible: null,
  setHeroVisible: () => {},
});

export const useHeroVisibility = () => useContext(HeroVisibilityContext);
