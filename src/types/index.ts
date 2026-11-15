export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'Breaking' | 'Rankings' | 'Analysis' | 'Playoffs' | 'Recruiting' | 'Game Recap';
  conference?: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  imageUrl: string;
  imageCaption?: string;
  featured?: boolean;
  trending?: boolean;
  tags: string[];
}

export interface TeamRanking {
  rank: number;
  previousRank: number;
  team: string;
  mascot: string;
  record: string;
  conference: string;
  points: number;
  firstPlaceVotes?: number;
  trend: 'up' | 'down' | 'same';
  logoColor: string;
}

export interface PlayoffProjection {
  seed: number;
  team: string;
  record: string;
  conference: string;
  type: 'Auto Bid' | 'At-Large';
  status: 'Host First Round Bye' | 'First Round Host' | 'Road Matchup';
  analystCommentary: string;
}

export interface PlayoffMatchup {
  id: string;
  round: 'First Round' | 'Second Round' | 'Quarterfinals' | 'Semifinals' | 'Championship';
  location: string;
  date: string;
  team1: {
    name: string;
    seed?: number;
    record: string;
    score?: number;
    isProjectedWinner?: boolean;
  };
  team2: {
    name: string;
    seed?: number;
    record: string;
    score?: number;
    isProjectedWinner?: boolean;
  };
}

export interface ConferenceStanding {
  team: string;
  mascot: string;
  confRecord: string;
  overallRecord: string;
  streak: string;
  homeRecord: string;
  awayRecord: string;
  isRanked?: number;
}

export interface ConferenceInfo {
  id: string;
  name: string;
  shortName: string;
  hq: string;
  founded: string;
  teamsCount: number;
  currentChampion: string;
  bannerColor: string;
  description: string;
  standings: ConferenceStanding[];
}

