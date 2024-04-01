/// <reference types="@uiw/react-amap-types" />

import { useMapContext } from '@uiw/react-amap-map';
import { useEventProperties } from '@uiw/react-amap-utils';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface MouseToolProps extends Partial<AMap.MouseTool>, AMap.MouseToolEvents {
  active: boolean;
  type: MouseToolDrawType; // TODO transform enum
  drawElementOptions?: AMap.PolygonOptions | AMap.PolylineOptions | AMap.MarkerOptions | AMap.CircleOptions;
  ifClear?: boolean;
  target?: AMap.MouseTool;
}
export enum MouseToolDrawType {
  MARKER,
  POLYLINE,
  POLYGON,
  CIRCLE,
  RECTANGLE,
  MEASUREAREA,
  RULE,
  RECTZOOMIN,
  RECTZOOMOUT,
}

export const MouseTool = forwardRef<MouseToolProps, MouseToolProps>((props, ref) => {
  const { active, type, drawElementOptions = {}, ifClear } = props;
  const { map } = useMapContext();
  const mouseTool = useRef<AMap.MouseTool>();
  useImperativeHandle(ref, () => ({ ...props, target: mouseTool.current }));

  useEffect(() => {
    if (map && !mouseTool.current && AMap && AMap.MouseTool) {
      mouseTool.current = new AMap.MouseTool(map);
    }
    return () => {
      if (mouseTool.current) {
        mouseTool.current.close();
        mouseTool.current = undefined;
      }
    };
  }, [map, mouseTool.current, AMap, AMap.MouseTool]);

  useEffect(() => {
    if (!mouseTool.current) {
      return;
    }

    if (!active) {
      mouseTool.current.close(ifClear);
    }

    console.log('type:>>', type);
    switch (type) {
      case MouseToolDrawType.MARKER:
        mouseTool.current.marker(drawElementOptions);
        break;
      case MouseToolDrawType.POLYLINE:
        mouseTool.current.polyline(drawElementOptions);
        break;
      case MouseToolDrawType.POLYGON:
        mouseTool.current.polygon(drawElementOptions);
        break;
      case MouseToolDrawType.CIRCLE:
        mouseTool.current.circle(drawElementOptions);
        break;
      case MouseToolDrawType.RECTANGLE:
        mouseTool.current.rectangle(drawElementOptions);
        break;
      case MouseToolDrawType.MEASUREAREA:
        mouseTool.current.measureArea(drawElementOptions);
        break;
      case MouseToolDrawType.RULE:
        mouseTool.current.rule(drawElementOptions);
        break;
      case MouseToolDrawType.RECTZOOMIN:
        mouseTool.current.rectZoomIn(drawElementOptions);
        break;
      case MouseToolDrawType.RECTZOOMOUT:
        mouseTool.current.rectZoomOut(drawElementOptions);
        break;
    }
  }, [mouseTool.current, active, ifClear]);

  useEventProperties<AMap.MouseToolAllEvents, AMap.MouseTool>(mouseTool.current!, props, ['onDraw']);
  return null;
});
