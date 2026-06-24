"use client";

import { MonitorPlay } from "lucide-react";

export type StreamPlatform = "twitch" | "youtube" | "kick";

const PLATFORMS: {
  id: StreamPlatform;
  label: string;
  viewers: string;
  activeBorder: string;
  hoverBorder: string;
  activeBg: string;
  iconActive: string;
  iconIdle: string;
  badgeClass: string;
  videoBg: string;
  completedType: "vod" | "highlights" | "replay";
}[] = [
  {
    id: "twitch",
    label: "Twitch",
    viewers: "112K",
    activeBorder: "border-purple-500/50",
    hoverBorder: "hover:border-purple-500/30",
    activeBg: "bg-purple-500/10",
    iconActive: "bg-purple-500 text-white",
    iconIdle: "bg-purple-500/20 text-purple-500 group-hover:bg-purple-500 group-hover:text-white",
    badgeClass: "text-purple-500 bg-purple-500/10",
    videoBg: "bg-purple-500",
    completedType: "vod",
  },
  {
    id: "youtube",
    label: "YouTube",
    viewers: "75K",
    activeBorder: "border-red-500/50",
    hoverBorder: "hover:border-red-500/30",
    activeBg: "bg-red-500/10",
    iconActive: "bg-red-500 text-white",
    iconIdle: "bg-red-500/20 text-red-500 group-hover:bg-red-500 group-hover:text-white",
    badgeClass: "text-red-500 bg-red-500/10",
    videoBg: "bg-red-500",
    completedType: "highlights",
  },
  {
    id: "kick",
    label: "Kick",
    viewers: "42K",
    activeBorder: "border-[#53FC18]/50",
    hoverBorder: "hover:border-[#53FC18]/30",
    activeBg: "bg-[#53FC18]/10",
    iconActive: "bg-[#53FC18] text-black",
    iconIdle: "bg-[#53FC18]/20 text-[#53FC18] group-hover:bg-[#53FC18] group-hover:text-black",
    badgeClass: "text-[#53FC18] bg-[#53FC18]/10",
    videoBg: "bg-[#53FC18]",
    completedType: "replay",
  },
];

type StreamPlatformButtonsProps = {
  isLive: boolean;
  isCompleted: boolean;
  activeVideo: StreamPlatform | null;
  onSelect: (platform: StreamPlatform) => void;
  waitingLabel: string;
  vodWatchLabel: string;
  highlightsLabel: string;
  replayLabel: string;
};

export function getStreamVideoBg(platform: StreamPlatform | null) {
  return PLATFORMS.find((p) => p.id === platform)?.videoBg ?? "bg-purple-500";
}

export default function StreamPlatformButtons({
  isLive,
  isCompleted,
  activeVideo,
  onSelect,
  waitingLabel,
  vodWatchLabel,
  highlightsLabel,
  replayLabel,
}: StreamPlatformButtonsProps) {
  const isUpcoming = !isLive && !isCompleted;

  return (
    <div className="flex flex-row gap-1.5 sm:gap-2 min-w-0">
      {PLATFORMS.map((platform) => {
        const isActive = activeVideo === platform.id;

        if (isUpcoming) {
          return (
            <div
              key={platform.id}
              className="flex-1 min-w-0 flex flex-col items-center justify-center gap-1 p-1.5 sm:p-2 rounded-lg opacity-50 cursor-not-allowed transition-colors"
              style={{ background: "var(--es-surface)", border: "1px solid var(--es-border)" }}
            >
              <div className="flex items-center gap-1 min-w-0 w-full justify-center">
                <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center shrink-0 ${platform.iconIdle.split(" group-hover")[0]}`}>
                  <MonitorPlay className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
                <span
                  className="text-[9px] sm:text-[10px] md:text-xs font-bold truncate min-w-0"
                  style={{ color: "var(--es-text-1)" }}
                >
                  {platform.label}
                </span>
              </div>
              <span
                className="text-[8px] sm:text-[9px] font-bold uppercase tracking-wide shrink-0"
                style={{ color: "var(--es-text-3)" }}
              >
                {waitingLabel}
              </span>
            </div>
          );
        }

        const completedBadge =
          platform.completedType === "vod"
            ? `VOD ${vodWatchLabel}`
            : platform.completedType === "highlights"
              ? highlightsLabel
              : replayLabel;

        return (
          <button
            key={platform.id}
            type="button"
            onClick={() => onSelect(platform.id)}
            className={`flex-1 min-w-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg transition-all border group cursor-pointer ${
              isActive ? `${platform.activeBg} ${platform.activeBorder}` : platform.hoverBorder
            }`}
            style={{
              background: isActive ? undefined : "var(--es-surface)",
              borderColor: isActive ? undefined : "var(--es-border)",
            }}
          >
            <div className="flex items-center gap-1 min-w-0 w-full justify-center">
              <div
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded flex items-center justify-center transition-colors shrink-0 ${
                  isActive ? platform.iconActive : platform.iconIdle
                }`}
              >
                <MonitorPlay className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <span
                className="text-[9px] sm:text-[10px] md:text-xs font-bold truncate min-w-0"
                style={{ color: "var(--es-text-1)" }}
              >
                {platform.label}
              </span>
            </div>
            {isLive ? (
              <div className="flex items-center gap-1 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[8px] sm:text-[9px] md:text-[10px] font-bold" style={{ color: "var(--es-text-3)" }}>
                  {platform.viewers}
                </span>
              </div>
            ) : (
              <span
                className={`text-[7px] sm:text-[8px] md:text-[9px] font-black uppercase tracking-wide px-1 py-0.5 rounded shrink-0 whitespace-nowrap ${platform.badgeClass}`}
              >
                {completedBadge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
