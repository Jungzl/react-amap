import React, { useImperativeHandle } from 'react';
import { OverlayProps } from '@uiw/react-amap-map';
import { useInfoWindow } from './useInfoWindow';

export * from './useInfoWindow';
export interface InfoWindowProps extends OverlayProps, AMap.InfoWindowEvents, AMap.InfoWindowOptions {
  /** 覆盖物是否可见 */
  visible?: boolean;
  children?: React.JSX.Element;
}
export const InfoWindow = React.forwardRef<InfoWindowProps, InfoWindowProps>((props, ref) => {
  const { infoWindow, InfoWindowPortal } = useInfoWindow(props);
  useImperativeHandle(ref, () => ({ ...props, infoWindow }));
  return <InfoWindowPortal>{props.children}</InfoWindowPortal>;
});
