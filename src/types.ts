export type ScreenId = 'welcome-and-sawaal' | 'memory-scrapbook' | 'birthday-letter';

export interface ReactionItem {
  id: string;
  emoji: string;
  count: number;
  colorClass: string;
}

export interface ScrapbookMemory {
  id: string;
  title: string;
  caption: string;
  date: string;
  image: string;
  rotation: string;
  tag: string;
}

export interface RoastCard {
  id: string;
  title: string;
  punchline: string;
  tag: string;
  icon: string;
}
