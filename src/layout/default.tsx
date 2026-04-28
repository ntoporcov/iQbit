import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  SimpleGrid,
  useColorModeValue,
  useTheme,
} from "@chakra-ui/react";
import NavButton from "../components/buttons/NavButton";
import { IconBaseProps } from "react-icons";
import { useIsLargeScreen } from "../utils/screenSize";
import { PageLabels, Pages } from "../Pages";
import Home from "../pages/Home";
import { NavLink, useLocation } from "react-router-dom";
import useScrollPosition from "../hooks/useScrollPosition";
import { useLogin } from "../utils/useLogin";
import { logout } from "../components/Auth";
import { isAndroid, isIOS } from "react-device-detect";
import { useReadLocalStorage } from "usehooks-ts";
import { defaultTabs } from "../pages/TabSelectorPage";
import { GlassContainer } from "../components/GlassContainer";
import { useIsPWA } from "../hooks/useIsPWA";

export interface DefaultLayoutProps {}

type Rgba = { r: number; g: number; b: number; a: number };
type SamplePoint = { x: number; y: number; luminance: number };

const backgroundImageCache = new Map<string, HTMLImageElement | "failed">();
const glassForegroundLuminanceThreshold = 0.68;
const darkSampleWeight = 2.5;
const darkClusterThreshold = 0.5;
const glassForegroundPollingInterval = 500;
const showGlassForegroundSamplePoints = false;

const parseRgba = (color: string): Rgba | undefined => {
  const match = color.match(
    /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/
  );

  if (!match) {
    return undefined;
  }

  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  };
};

const composite = (top: Rgba, bottom: Rgba): Rgba => {
  const alpha = top.a + bottom.a * (1 - top.a);

  if (alpha === 0) {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  return {
    r: (top.r * top.a + bottom.r * bottom.a * (1 - top.a)) / alpha,
    g: (top.g * top.a + bottom.g * bottom.a * (1 - top.a)) / alpha,
    b: (top.b * top.a + bottom.b * bottom.a * (1 - top.a)) / alpha,
    a: alpha,
  };
};

const luminance = ({ r, g, b }: Rgba) => {
  const channel = (value: number) => {
    const normalized = value / 255;

    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4);
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
};

const getImageColorAtPoint = (
  element: Element | null,
  x: number,
  y: number
): Rgba | undefined => {
  if (!(element instanceof HTMLImageElement) || !element.complete) {
    return undefined;
  }

  const rect = element.getBoundingClientRect();

  if (!element.naturalWidth || !element.naturalHeight || rect.width === 0) {
    return undefined;
  }

  const sourceX = Math.max(
    0,
    Math.min(
      element.naturalWidth - 1,
      Math.round(((x - rect.left) / rect.width) * element.naturalWidth)
    )
  );
  const sourceY = Math.max(
    0,
    Math.min(
      element.naturalHeight - 1,
      Math.round(((y - rect.top) / rect.height) * element.naturalHeight)
    )
  );
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");

  if (!context) {
    return undefined;
  }

  try {
    context.drawImage(element, sourceX, sourceY, 1, 1, 0, 0, 1, 1);
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;

    return { r, g, b, a: a / 255 };
  } catch {
    return undefined;
  }
};

const extractBackgroundImageUrls = (backgroundImage: string) => {
  return Array.from(backgroundImage.matchAll(/url\(["']?([^"')]+)["']?\)/g)).map(
    (match) => match[1]
  );
};

const getGradientColorAtPoint = (
  element: Element,
  x: number,
  y: number
): Rgba | undefined => {
  const styles = getComputedStyle(element);

  if (!styles.backgroundImage.includes("linear-gradient")) {
    return undefined;
  }

  const colors = Array.from(
    styles.backgroundImage.matchAll(
      /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/g
    )
  ).map((match) => ({
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: match[4] === undefined ? 1 : Number(match[4]),
  }));

  if (colors.length === 0) {
    return undefined;
  }

  const rect = element.getBoundingClientRect();
  const progressFromTop = Math.max(0, Math.min(1, (y - rect.top) / rect.height));
  const isToTop =
    styles.backgroundImage.includes("to top") ||
    styles.backgroundImage.includes("0deg");
  const first = colors[0];

  return {
    ...first,
    a: first.a * (isToTop ? progressFromTop : 1 - progressFromTop),
  };
};

const getCachedBackgroundImage = (url: string) => {
  const cached = backgroundImageCache.get(url);

  if (cached) {
    return cached === "failed" ? undefined : cached;
  }

  const image = new Image();
  image.crossOrigin = "anonymous";
  image.onload = () => backgroundImageCache.set(url, image);
  image.onerror = () => backgroundImageCache.set(url, "failed");
  image.src = url;
  backgroundImageCache.set(url, image);

  return undefined;
};

const getBackgroundImageColorAtPoint = (
  element: Element,
  x: number,
  y: number
): Rgba | undefined => {
  const styles = getComputedStyle(element);
  const urls = extractBackgroundImageUrls(styles.backgroundImage);
  const image = urls.map(getCachedBackgroundImage).find(Boolean);

  if (!image?.complete || !image.naturalWidth || !image.naturalHeight) {
    return undefined;
  }

  const rect = element.getBoundingClientRect();
  const elementRatio = rect.width / rect.height;
  const imageRatio = image.naturalWidth / image.naturalHeight;
  const coversByWidth = elementRatio > imageRatio;
  const renderedWidth = coversByWidth ? rect.width : rect.height * imageRatio;
  const renderedHeight = coversByWidth ? rect.width / imageRatio : rect.height;
  const renderedLeft = rect.left + (rect.width - renderedWidth) / 2;
  const renderedTop = rect.top + (rect.height - renderedHeight) / 2;
  const sourceX = Math.max(
    0,
    Math.min(
      image.naturalWidth - 1,
      Math.round(((x - renderedLeft) / renderedWidth) * image.naturalWidth)
    )
  );
  const sourceY = Math.max(
    0,
    Math.min(
      image.naturalHeight - 1,
      Math.round(((y - renderedTop) / renderedHeight) * image.naturalHeight)
    )
  );
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const context = canvas.getContext("2d");

  if (!context) {
    return undefined;
  }

  try {
    context.drawImage(image, sourceX, sourceY, 1, 1, 0, 0, 1, 1);
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data;

    return { r, g, b, a: a / 255 };
  } catch {
    urls.forEach((url) => backgroundImageCache.set(url, "failed"));
    return undefined;
  }
};

const getBackgroundColorAtPoint = (
  x: number,
  y: number,
  ignoredElement: HTMLElement
) => {
  const stack = document
    .elementsFromPoint(x, y)
    .filter(
      (element) =>
        !ignoredElement.contains(element) &&
        !element.hasAttribute("data-glass-luminance-debug")
    );
  const target = stack[0] ?? null;
  const imageColor = getImageColorAtPoint(target, x, y);

  if (imageColor) {
    return imageColor;
  }

  const fallback =
    document.documentElement.dataset.theme === "dark"
      ? { r: 0, g: 0, b: 0, a: 1 }
      : { r: 255, g: 255, b: 255, a: 1 };
  const colors: Rgba[] = [];

  for (let node = target; node; node = node.parentElement) {
    const gradientColor = getGradientColorAtPoint(node, x, y);

    if (gradientColor) {
      colors.push(gradientColor);
    }

    const backgroundImageColor = getBackgroundImageColorAtPoint(node, x, y);

    if (backgroundImageColor) {
      return colors.reduceRight(
        (bottom, top) => composite(top, bottom),
        backgroundImageColor
      );
    }

    const background = parseRgba(getComputedStyle(node).backgroundColor);

    if (background && background.a > 0) {
      colors.push(background);
    }
  }

  return colors.reduceRight((bottom, top) => composite(top, bottom), fallback);
};

const useAdaptiveGlassForeground = (enabled: boolean) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef<number>();
  const [foregroundColor, setForegroundColor] = useState<"black" | "white">(
    "black"
  );
  const [samplePoints, setSamplePoints] = useState<SamplePoint[]>([]);

  const updateForeground = useCallback(() => {
    const element = ref.current;

    if (!enabled || !element) {
      return;
    }

    const rect = element.getBoundingClientRect();
    const nextSamplePoints = [0.1, 0.23, 0.36, 0.5, 0.64, 0.77, 0.9].flatMap(
      (verticalOffset) =>
        [0.06, 0.17, 0.28, 0.39, 0.5, 0.61, 0.72, 0.83, 0.94].map(
          (horizontalOffset) => [
            rect.left + rect.width * horizontalOffset,
            rect.top + rect.height * verticalOffset,
          ]
        )
    );
    const samples = nextSamplePoints.map(([x, y]) => {
      return {
        x,
        y,
        luminance: luminance(getBackgroundColorAtPoint(x, y, element)),
      };
    });
    const sampleSpacing = Math.min(rect.width / 8, rect.height / 6);
    const weightedSamples = samples.map((sample) => {
      const neighbors = samples.filter((neighbor) => {
        return Math.hypot(sample.x - neighbor.x, sample.y - neighbor.y) <= sampleSpacing * 1.45;
      });
      const darkNeighborRatio =
        neighbors.filter((neighbor) => neighbor.luminance < darkClusterThreshold)
          .length / neighbors.length;

      return {
        luminance: sample.luminance,
        weight:
          1 +
          Math.max(0, darkClusterThreshold - sample.luminance) *
            darkSampleWeight *
            darkNeighborRatio,
      };
    });
    const averageLuminance =
      weightedSamples.reduce(
        (total, sample) => total + sample.luminance * sample.weight,
        0
      ) / weightedSamples.reduce((total, sample) => total + sample.weight, 0);

    if (showGlassForegroundSamplePoints) {
      setSamplePoints(samples);
    }

    setForegroundColor(
      averageLuminance > glassForegroundLuminanceThreshold ? "black" : "white"
    );
  }, [enabled]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const visualViewport = window.visualViewport;
    const scheduleUpdate = () => {
      if (frame.current !== undefined) {
        cancelAnimationFrame(frame.current);
      }

      frame.current = requestAnimationFrame(updateForeground);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, true);
    document.addEventListener("scroll", scheduleUpdate, true);
    document.addEventListener("touchmove", scheduleUpdate, { passive: true });
    document.addEventListener("wheel", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", scheduleUpdate);
    window.addEventListener("load", scheduleUpdate);
    visualViewport?.addEventListener("scroll", scheduleUpdate);
    visualViewport?.addEventListener("resize", scheduleUpdate);
    const interval = window.setInterval(
      scheduleUpdate,
      glassForegroundPollingInterval
    );

    return () => {
      if (frame.current !== undefined) {
        cancelAnimationFrame(frame.current);
      }

      window.clearInterval(interval);
      window.removeEventListener("scroll", scheduleUpdate, true);
      document.removeEventListener("scroll", scheduleUpdate, true);
      document.removeEventListener("touchmove", scheduleUpdate);
      document.removeEventListener("wheel", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", scheduleUpdate);
      window.removeEventListener("load", scheduleUpdate);
      visualViewport?.removeEventListener("scroll", scheduleUpdate);
      visualViewport?.removeEventListener("resize", scheduleUpdate);
    };
  }, [enabled, updateForeground]);

  return { ref, foregroundColor, samplePoints };
};

const DefaultLayout = (props: PropsWithChildren<DefaultLayoutProps>) => {
  const { handleLogin, localCreds } = useLogin();
  const { pathname } = useLocation();

  useEffect(() => {
    handleLogin({
      username: localCreds.username,
      password: localCreds.password,
    });
  }, [localCreds.username, localCreds.password, handleLogin]);

  const theme = useTheme();

  const activeColor = theme.colors.blue[500];

  const sharedNavButtonProps = {
    activeColor,
  };
  const iconProps: IconBaseProps = {
    size: 24,
  };
  const activeIconProps: IconBaseProps = {
    color: activeColor,
  };

  const isPWA = useIsPWA();
  const isLarge = useIsLargeScreen();
  const mobileNavForeground = useAdaptiveGlassForeground(!isLarge);

  const largeWorkAreaBgColor = useColorModeValue("white", "gray.900");

  const storedTabs = useReadLocalStorage<(PageLabels | "")[]>("tabs-v2");
  const tabsSelected = storedTabs ?? defaultTabs;

  const middleTab = tabsSelected[0] || "Trending";
  const rightTab = tabsSelected[1] || "Search";

  const DownloadsPage = Pages.find((page) => page.label === "Downloads")!;
  const SettingsPage = Pages.find((page) => page.label === "Settings")!;
  const MiddleTab = Pages.find((page) => page.label === middleTab)!;
  const RightTab = Pages.find((page) => page.label === rightTab)!;
  const mobileGlassStyle = {
    "--glass-brightness":
      mobileNavForeground.foregroundColor === "white" ? "0.74" : "1.12",
    "--glass-shine-opacity":
      mobileNavForeground.foregroundColor === "white" ? "0.82" : "1",
    "--glass-specular-opacity":
      mobileNavForeground.foregroundColor === "white" ? "0.34" : "0.58",
    "--glass-specular-hotspot-opacity":
      mobileNavForeground.foregroundColor === "white" ? "0.08" : "0.14",
    "--glass-specular-soft-opacity":
      mobileNavForeground.foregroundColor === "white" ? "0.12" : "0.2",
  } as React.CSSProperties;

  return (
    <Box px={5} pb={100}>
      <Flex
        gap={isLarge ? 10 : undefined}
        as={"main"}
        mb={"30vh"}
        id={"app-container"}
      >
        <Box maxWidth={isLarge ? "400px" : undefined} width={"100%"}>
          {isLarge ? <Home /> : props.children}
        </Box>
        {isLarge && (
          <Flex
            flexGrow={1}
            mt={6}
            as={"aside"}
            backgroundColor={largeWorkAreaBgColor}
            height={"calc(100dvh - 40px)"}
            shadow={"lg"}
            rounded={12}
            overflow={"hidden"}
            position={"fixed"}
            width={"calc(100% - 470px)"}
            left={"450px"}
            id={"desktop-container"}
          >
            <Flex
              flexDirection={"column"}
              backgroundColor={"grayAlpha.300"}
              height={"100%"}
              justifyContent={"space-between"}
              p={5}
            >
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                {Pages.filter((page) => page.visibleOn.includes("sideNav")).map(
                  ({ url, Icon, label }) => (
                    <NavButton
                      key={url}
                      {...sharedNavButtonProps}
                      path={url}
                      icon={{
                        active: Icon.active({
                          ...activeIconProps,
                          ...iconProps,
                        }),
                        inactive: Icon.inactive({ ...iconProps }),
                      }}
                      label={label}
                    />
                  )
                )}
              </Flex>
              <Flex
                flexDirection={"column"}
                justifyContent={"flex-start"}
                gap={2}
              >
                {Pages.filter((page) =>
                  page.visibleOn.includes("sideNavBottom")
                ).map(({ url, Icon, label }) => (
                  <NavButton
                    key={url}
                    {...sharedNavButtonProps}
                    path={url}
                    icon={{
                      active: Icon.active({
                        ...activeIconProps,
                        ...iconProps,
                      }),
                      inactive: Icon.inactive({ ...iconProps }),
                    }}
                    label={label}
                  />
                ))}
                <Divider my={2} />
                <Button
                  variant={"ghost"}
                  colorScheme={"red"}
                  size={"xs"}
                  fontWeight={"normal"}
                  fontSize={"sm"}
                  textAlign={"left"}
                  onClick={logout}
                >
                  Log Out
                </Button>
              </Flex>
            </Flex>
            <Flex
              flexDirection={"column"}
              height={"100%"}
              p={5}
              flexGrow={2}
              overflowY={"auto"}
              overflowX={"hidden"}
            >
              {pathname === "/"
                ? Pages.filter((page) => page.label === "Search")[0].component
                : props.children}
            </Flex>
          </Flex>
        )}
      </Flex>
      {!isLarge && (
        <Flex
          ref={mobileNavForeground.ref}
          width={"calc(100% - 40px)"}
          left={"20px"}
          position={"fixed"}
          bottom={isPWA ? "25px" : "5px"}
          gap={3}
          id={"mobile-container"}
        >
          {showGlassForegroundSamplePoints && mobileNavForeground.samplePoints.map((sample, index) => (
            <Box
              key={index}
              position={"fixed"}
              left={`${sample.x}px`}
              top={`${sample.y}px`}
              width={2}
              height={2}
              rounded={999}
              style={{
                backgroundColor: `hsl(${240 - sample.luminance * 240}, 90%, 50%)`,
              }}
              border={"1px solid white"}
              transform={"translate(-50%, -50%)"}
              zIndex={1002}
              pointerEvents={"none"}
            />
          ))}
          <GlassContainer
            flexGrow={1}
            rounded={99999999}
            zIndex={1000}
            noTint
            overflow={"visible"}
            style={mobileGlassStyle}
          >
            <Flex as={"nav"} width={"100%"}>
              {[DownloadsPage, MiddleTab, SettingsPage].map(
                ({ url, Icon, label }) => {
                  return (
                    <NavButton
                      key={url}
                      {...sharedNavButtonProps}
                      foregroundColor={mobileNavForeground.foregroundColor}
                      path={url}
                      icon={{
                        active: Icon.active({
                          ...iconProps,
                          color: mobileNavForeground.foregroundColor,
                        }),
                        inactive: Icon.inactive({ ...iconProps }),
                      }}
                      label={label}
                    />
                  );
                }
              )}
            </Flex>
          </GlassContainer>
          <GlassContainer
            rounded={"100%"}
            h={16}
            aspectRatio={"1 / 1"}
            noTint
            style={mobileGlassStyle}
          >
            <NavButton
              {...sharedNavButtonProps}
              foregroundColor={mobileNavForeground.foregroundColor}
              path={RightTab.url}
              icon={{
                active: RightTab.Icon.active({
                  ...iconProps,
                  color: mobileNavForeground.foregroundColor,
                }),
                inactive: RightTab.Icon.inactive({ ...iconProps }),
              }}
              label={""}
            />
          </GlassContainer>
        </Flex>
      )}
    </Box>
  );
};

export default DefaultLayout;
