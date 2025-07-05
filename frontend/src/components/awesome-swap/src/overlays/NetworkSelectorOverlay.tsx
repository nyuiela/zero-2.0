import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDebounce } from "use-debounce";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sort, useSortedChains } from "../hooks/sort";
import { useSettingsState } from "../state/settings";

import { ChainCard } from "../components/chain-card";
import {
  IconClose,
  IconEVM,
  IconEverything,
  IconSVM,
  IconSearch,
  IconSort,
  IconSuperchain,
} from "../components/icons/icons";
import { CHAIN_IDS, ChainDto } from "..";
import { useIsHyperlanePlayground, useIsLzPlayground, useIsUltra } from "./use-is-hyperlane";

// Animations
const container = {
  hidden: {
    y: "5vh",
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.15,
    },
  },
  show: {
    opacity: 1,
    y: "0vh",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 16,
      staggerChildren: 0.05,
      delayChildren: 0.1,
      // staggerDirection: -1,
    },
  },
};

const searchContainer = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    transition: {
      type: "tween" as const,
      duration: 0.15,
    },
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
};

const searchInput = {
  hidden: {
    width: "auto",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  show: {
    width: "100%",
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
};

const PlacehoderItem = {
  hidden: { opacity: 0, scale: 0.85 },
  show: {
    opacity: 0.2,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 12,
    },
  },
};

const sortItem = {
  hidden: {
    opacity: 0,
    x: "40%",
    scale: 0.85,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
    },
  },
  show: {
    opacity: 1,
    x: "40%",
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 12,
    },
  },
};

const sortButton = {
  hidden: {
    opacity: 0,
    scale: 0.85,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20,
    },
  },
  show: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 30,
      delay: 0.2,
    },
  },
};

const filterContainer = {
  hidden: {
    opacity: 0,
    transition: {
      type: "tween" as const,
      duration: 0.15,
    },
  },
  show: {
    opacity: 1,
    transition: {
      type: "tween" as const,
      duration: 0.15,
    },
  },
};

const useHasFilters = (chains: ChainDto[]) => {
  const isUltra = useIsUltra();
  const isLz = useIsLzPlayground();
  const isHl = useIsHyperlanePlayground();

  return (isUltra || isLz || isHl) && chains.length > 8;
};

type Filter = "superchain" | "svm" | "evm" | "all";

const filterOptions: {
  [f in Filter]: {
    label: string;
    icon: React.ReactElement;
    fn: (chain: Partial<ChainDto>) => boolean;
  };
} = {
  superchain: {
    label: "Superchain",
    icon: (
      <IconSuperchain className="w-6 h-6 fill-foreground relative z-10 transform-gpu" />
    ),
    fn: (c) => CHAIN_IDS.superchain.includes(c.id ?? 0),
  },
  svm: {
    label: "SVM",
    icon: (
      <IconSVM className="w-6 h-6 fill-foreground relative z-10 transform-gpu" />
    ),
    fn: (c) => !!c.solana,
  },
  evm: {
    label: "EVM",
    icon: (
      <IconEVM className="w-6 h-6 fill-foreground relative z-10 transform-gpu" />
    ),
    fn: (c) => !c.solana,
  },
  all: {
    label: "All",
    icon: (
      <IconEverything className="w-6 h-6 fill-foreground relative z-10 transform-gpu" />
    ),
    fn: (_c) => true,
  },
};

const Filters = ({
  chains,
  activeFilter,
  onSelectFilter,
}: {
  chains: ChainDto[];
  activeFilter: Filter | null;
  onSelectFilter: (f: Filter | null) => void;
}) => {
  const filters: Filter[] = [];

  if (
    chains.find((c) => filterOptions.superchain.fn(c)) &&
    chains.find((c) => !filterOptions.superchain.fn(c))
  ) {
    filters.push("superchain");
  }

  if (
    chains.find((c) => filterOptions.svm.fn(c)) &&
    chains.find((c) => filterOptions.evm.fn(c))
  ) {
    filters.push("evm");
    filters.push("svm");
  }

  if (filters.length) {
    filters.unshift("all");
  }

  return (
    <div className="flex items-center justify-start md:justify-center gap-1 overflow-x-auto scroll-smooth snap-x snap-mandatory scroll-ps-6 scroll-pe-6 scroll-px-6 px-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {filters.map((f) => (
        <Button
          key={f}
          className="flex items-center rounded-full gap-2 relative overflow-hidden bg-transparent pr-5 snap-start shrink-0 transform-gpu shadow-none"
          onClick={(e) => {
            e.stopPropagation();
            onSelectFilter(f);
          }}
        >
          <div
            className={clsx(
              "absolute inset-0 bg-card transform-gpu",
              f === activeFilter && "opacity-100",
              f !== activeFilter && "opacity-30"
            )}
          ></div>
          <>{filterOptions[f].icon}</>
          <span className="text-foreground text-sm font-button relative z-10 transform-gpu">
            {filterOptions[f].label}
          </span>
        </Button>
      ))}
    </div>
  );
};

const useDefaultFilter = (): Filter | null => {
  const isUltra = useIsUltra();

  if (isUltra) return "superchain";
  return "all";
};

export const NetworkSelector = ({
  onSelect,
  onClose,
  networks,
  comingSoonNetworks,
}: {
  onSelect: (n: Pick<ChainDto, "id" | "name">) => void;
  onClose: () => void;
  networks: ChainDto[];
  comingSoonNetworks: (Pick<ChainDto, "id" | "name"> & { comingSoon: true })[];
}) => {
  const { t } = useTranslation();

  const [sort, setSort] = useState<Sort>("Default");

  const defaultFilter = useDefaultFilter();
  const [activeFilter, setActiveFilter] = useState<Filter | null>(
    defaultFilter
  );
  const hasFilters = useHasFilters(networks);

  const hasSearch = networks.length > 8;
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 100);
  const recentChainIds = useSettingsState.useRecentChainIds();
  const addRecentChainId = useSettingsState.useAddRecentChainId();

  const activeNetworks = useSortedChains(
    [...networks, ...comingSoonNetworks].filter((chain) => {
      if (isSearching) {
        if (!debouncedSearch) return recentChainIds.includes(chain.id);
        return chain.name.toLowerCase().includes(debouncedSearch.toLowerCase());
      }

      if (activeFilter) return filterOptions[activeFilter].fn(chain);
      return true;
    }),
    sort
  );

  return (
    <main
      className="flex items-start justify-center scroll-smooth overflow-y-scroll w-screen h-dvh fixed inset-0 px-0 py-20 z-[25]"
      key="bridgeMain"
      onClick={onClose}
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.1 }}
        whileHover={{ scale: 1.1 }}
        key="close-activity-button"
        className={`flex items-center cursor-pointer w-10 h-10 shrink-0 justify-center rounded-full shadow-sm bg-card fixed top-6 right-6 z-10`}
      >
        <IconClose className="fill-foreground w-3.5 h-3.5" />
      </motion.button>
      <motion.div
        variants={container}
        initial={"hidden"}
        animate={"show"}
        exit={"hidden"}
        className="flex flex-col items-center w-full"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key="search-container"
            variants={searchContainer}
            initial="hidden"
            animate="show"
            exit="hidden"
            className="relative w-full flex justify-center items-center gap-2 px-6 pb-10 lg:pb-16"
            onClick={(e) => e.stopPropagation()}
          >
            {!hasSearch && (
              <div className="flex items-center gap-3 bg-card px-6 py-3 rounded-full shadow-sm">
                <h1 className="text-xl font-heading">
                  {t("networkSelectorModal.title")}
                </h1>
              </div>
            )}
            {hasSearch && (
              <>
                <motion.div
                  variants={searchInput}
                  initial={isSearching ? "show" : "hidden"}
                  animate={isSearching ? "show" : "hidden"}
                  className="relative max-w-lg"
                  key="search-input"
                >
                  {isSearching ? (
                    <div className="flex items-center w-full h-14 bg-card rounded-full pl-6 pr-4 leading-none">
                      <IconSearch className="w-5 h-5 fill-foreground" />
                      <Input
                        autoFocus
                        className="flex-1 bg-transparent border-none shadow-none outline-none ring-0 focus:outline-none focus:ring-0 focus-visible:ring-0 text-foreground text-lg leading-none"
                        placeholder={t("activity.findANetwork")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                      <button
                        className="ml-2 rounded-full transition-all hover:bg-muted w-5 h-5 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearch("");
                          setIsSearching(false);
                        }}
                      >
                        <IconClose className="w-2.5 h-2.5 fill-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center w-full">
                      <button
                        className="group flex items-center h-14 bg-card rounded-full pl-6 pr-8 min-w-[232px] w-full leading-none cursor-pointer hover:scale-[1.03] transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsSearching(true);
                        }}
                        tabIndex={0}
                        role="button"
                        aria-label="Find a network"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            setIsSearching(true);
                          }
                        }}
                      >
                        <IconSearch className="group-hover:animate-wiggle-waggle w-5 h-5 fill-foreground shrink-0" />
                        <span className="text-foreground text-lg whitespace-nowrap font-button ml-4">
                          {t("activity.findANetwork")}
                        </span>
                      </button>
                    </div>
                  )}
                </motion.div>

                {!isSearching && (
                  <motion.div
                    variants={sortButton}
                    initial="hidden"
                    animate="show"
                    exit="hidden"
                    className="flex items-center justify-center"
                    key="sort-button"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size={"icon"}
                          className="relative bg-card h-14 w-14 focus-visible:ring-0 focus-visible:ring-offset-0"
                        >
                          <IconSort className="w-6 h-6 fill-foreground" />

                          <AnimatePresence>
                            {sort !== "Default" && (
                              <motion.span
                                variants={sortItem}
                                initial="hidden"
                                animate="show"
                                exit="hidden"
                                key="sort-item"
                                className="absolute top-0 tracking-tighter -right-0 bg-primary text-primary-foreground text-xs leading-none rounded-full px-2 py-1"
                              >
                                {sort}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent
                        align="end"
                        side="bottom"
                        className="w-screen max-w-[280px]"
                      >
                        <DropdownMenuGroup className="my-2">
                          <DropdownMenuCheckboxItem
                            checked={sort === "Default"}
                            onCheckedChange={(e) => {
                              if (e) setSort("Default");
                            }}
                          >
                            Default
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={sort === "A-Z"}
                            onCheckedChange={(e) => {
                              if (e) setSort("A-Z");
                            }}
                          >
                            A-Z
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            checked={sort === "Z-A"}
                            onCheckedChange={(e) => {
                              if (e) setSort("Z-A");
                            }}
                          >
                            Z-A
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                )}
              </>
            )}
          </motion.div>
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {!isSearching && hasSearch && hasFilters && (
            <motion.div
              variants={filterContainer}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="w-full pb-6 lg:pb-8"
              key="filter-container"
            >
              <Filters
                chains={networks}
                activeFilter={activeFilter}
                onSelectFilter={(f) => {
                  if (f === activeFilter) return;
                  setActiveFilter(f);
                }}
              />
            </motion.div>
          )}

          {isSearching && !search && recentChainIds.length > 0 && (
            <motion.div
              variants={filterContainer}
              initial="hidden"
              animate="show"
              exit="hidden"
              className="w-full flex justify-center pb-6 lg:pb-8"
              key="heading-container"
            >
              <div className="relative rounded-full px-5 py-3 overflow-hidden">
                <div className="absolute inset-0 bg-card opacity-30"></div>
                <h3 className="relative z-10 text-sm font-heading">
                  Recent searches
                </h3>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full px-6 max-w-5xl">
          <motion.div
            key={`${debouncedSearch}-${activeFilter}-${isSearching}`}
            variants={container}
            initial="hidden"
            animate="show"
            className="contents"
          >
            {activeNetworks.map((chain) => (
              <ChainCard
                key={chain.id}
                chain={chain}
                onSelect={(e) => {
                  e.stopPropagation();
                  if ("comingSoon" in chain) {
                    return;
                  }

                  if (debouncedSearch) {
                    addRecentChainId(chain.id);
                  }

                  onSelect(chain);
                }}
              />
            ))}

            {activeNetworks.length < 8 &&
              [...Array(8 - activeNetworks.length)].map((_, i) => {
                return (
                  <motion.div
                    variants={PlacehoderItem}
                    className="bg-card border relative w-full aspect-[3.25/4] rounded-2xl shadow-sm"
                    key={i}
                  ></motion.div>
                );
              })}
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
};
