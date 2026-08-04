"use client";

import { createContext, useContext } from "react";

type PageScrollNavContextValue = {
  /** True when a scroll-swap page has been scrolled past the top. */
  scrolled: boolean;
};

export const PageScrollNavContext = createContext<PageScrollNavContextValue>({
  scrolled: false,
});

export const usePageScrollNav = () => useContext(PageScrollNavContext);
