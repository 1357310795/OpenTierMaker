
export interface TierLevel {
  id: string;
  label: string;
  color: string;
  items: TierItem[];
}


export interface TierItem {
  id: string;
  type: 'image' | 'text';
  title?: string;
  textColor?: string;
  bgColor?: string;
  imgContent?: string;
}