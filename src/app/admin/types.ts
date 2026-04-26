// Admin Dashboard Type Definitions

export interface DistributionItem {
  name: string;
  value: number;
}

export interface LocationItem {
  name: string;
  value: number;
}

export interface SourceItem {
  name: string;
  count: number;
}

export interface ArticleItem {
  title?: {
    fr?: string;
  };
  slug?: string;
  reads_count?: number;
  likes_count?: number;
}

export interface ChartDataPoint {
  name: string;
  visits: number;
}

export interface AnalyticsRecord {
  created_at: string;
  language: string;
  session_id: string | null;
  metadata: Record<string, any> | null;
  ip_address: string | null;
  referrer: string | null;
  path: string;
}

export interface AdminStats {
  totalArticles: number;
  totalVisits: number;
  uniqueVisitors: number;
  todayVisits: number;
  todayUniqueVisitors: number;
  totalUsers: number;
  totalLikes: number;
  langDistribution: DistributionItem[];
  deviceDistribution: DistributionItem[];
  topLocations: LocationItem[];
  recentIps: string[];
  topSources: SourceItem[];
  // Today distributions (all visits)
  todayLangDistribution: DistributionItem[];
  todayDeviceDistribution: DistributionItem[];
  todayTopLocations: LocationItem[];
  todayTopSources: SourceItem[];
  // Today distributions (unique)
  todayLangDistribUniq: DistributionItem[];
  todayDeviceDistribUniq: DistributionItem[];
  todayTopLocationsUniq: LocationItem[];
  todayTopSourcesUniq: SourceItem[];
  // Total distributions (unique)
  totalLangDistribUniq: DistributionItem[];
  totalDeviceDistribUniq: DistributionItem[];
  totalTopLocationsUniq: LocationItem[];
  totalTopSourcesUniq: SourceItem[];
}

// Component Props Types
export interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  color?: string;
  bgColor?: string;
}

export interface AnalyticsChartProps {
  chartData: ChartDataPoint[];
  timeframe: "24_hours" | "7_days" | "30_days" | "6_months";
  onTimeframeChange: (timeframe: string) => void;
}

export interface TopArticlesSectionProps {
  topArticles: ArticleItem[];
}

export interface LanguagesDevicesInsightsProps {
  stats: AdminStats;
  insightView: "today" | "total";
  insightUnique: boolean;
  onInsightViewChange: (view: "today" | "total") => void;
  onInsightUniqueChange: (unique: boolean) => void;
}
