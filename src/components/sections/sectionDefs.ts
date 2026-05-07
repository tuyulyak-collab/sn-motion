export type SectionStatus = "active" | "advanced" | "coming-soon";

export type SectionId =
  | "dashboard"
  | "single-motion"
  | "batch-motion"
  | "preview"
  | "export"
  | "assets"
  | "settings"
  | "activity-log";

export type SectionDef = {
  id: SectionId;
  label: string;
  helper: string;
  icon: string;
  status: SectionStatus;
};

export const SECTIONS: SectionDef[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    helper: "Overview of your motion project.",
    icon: "home",
    status: "active",
  },
  {
    id: "single-motion",
    label: "Single Motion",
    helper:
      "Describe a motion idea and adjust video settings. One motion at a time.",
    icon: "sparkles",
    status: "active",
  },
  {
    id: "batch-motion",
    label: "Batch Motion",
    helper: "Prepare multiple motion videos from a text file.",
    icon: "layers",
    status: "coming-soon",
  },
  {
    id: "preview",
    label: "Preview",
    helper: "Watch your video before exporting.",
    icon: "play",
    status: "active",
  },
  {
    id: "export",
    label: "Export",
    helper: "Render and download your video.",
    icon: "download",
    status: "active",
  },
  {
    id: "assets",
    label: "Assets",
    helper: "Manage images, audio, and backgrounds.",
    icon: "folder",
    status: "coming-soon",
  },
  {
    id: "settings",
    label: "Settings",
    helper: "Manage defaults and future provider settings.",
    icon: "settings",
    status: "active",
  },
  {
    id: "activity-log",
    label: "Activity Log",
    helper: "Track app actions, generation status, and export status.",
    icon: "activity",
    status: "coming-soon",
  },
];

export const DEFAULT_SECTION: SectionId = "dashboard";

export const findSection = (id: SectionId): SectionDef => {
  const section = SECTIONS.find((s) => s.id === id);
  if (!section) {
    return SECTIONS[0];
  }
  return section;
};
