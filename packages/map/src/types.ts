import React from 'react';

export type RenderProps =
  | { children?: (data: { AMap: typeof AMap; map: AMap.Map; container?: HTMLDivElement | null }) => undefined }
  | { children?: React.ReactNode };

export interface MapProps extends AMap.MapEvents, AMap.MapOptions {
  className?: string;
  style?: React.CSSProperties;
  container?: HTMLDivElement | null;
  children?: React.JSX.Element & RenderProps['children'];
}
