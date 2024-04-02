import { useMapContext } from '@uiw/react-amap-map';
import { useEventProperties } from '@uiw/react-amap-utils';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface MouseToolProps extends Partial<AMap.MouseTool>, AMap.MouseToolEvents {
  /** 是否开启 */
  active: boolean;
  /* 绘制模式 */
  type: MouseToolDrawType;
  /** 绘制的覆盖物样式 */
  drawElementOptions?: AMap.PolygonOptions | AMap.PolylineOptions | AMap.MarkerOptions | AMap.CircleOptions;
  /**
   * 设为true时，鼠标操作关闭的同时清除地图上绘制的所有覆盖物对象；设为false时，保留所绘制的覆盖物对象。
   * @default false
   */
  ifClear?: boolean;
  /** 实例对象 */
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
  const { active, type, drawElementOptions = {}, ifClear = false } = props;
  const { map } = useMapContext();
  const mouseTool = useRef<AMap.MouseTool>();
  const dragEnable = useRef<boolean>();

  useImperativeHandle(ref, () => ({ ...props, target: mouseTool.current }));

  useEffect(() => {
    if (map && !mouseTool.current && AMap.MouseTool) {
      mouseTool.current = new AMap.MouseTool(map);
      dragEnable.current = map.getStatus().dragEnable;
    }
  }, [map, mouseTool.current, AMap.MouseTool]);

  useEffect(() => {
    if (!mouseTool.current) {
      return;
    }

    if (!active) {
      mouseTool.current.close(ifClear);
      // after rectZoomIn or rectZoomOut, the dragEnable will be false, so reset it.
      map?.setStatus({ dragEnable: dragEnable.current });
    } else {
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
    }
  }, [active, ifClear, type]);

  useEventProperties<AMap.MouseToolAllEvents, AMap.MouseTool>(mouseTool.current!, props, ['onDraw']);

  return null;
});
