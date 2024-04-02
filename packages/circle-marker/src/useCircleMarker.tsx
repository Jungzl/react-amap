import { useState, useEffect } from 'react';
import { useVisible, useEventProperties, useSettingProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { CircleMarkerProps } from '.';

export interface UseCircleMarker extends CircleMarkerProps {}
export const useCircleMarker = (props = {} as UseCircleMarker) => {
  const { visible, ...other } = props;
  const { map } = useMapContext();
  const [circleMarker, setCircleMarker] = useState<AMap.CircleMarker>();
  useEffect(() => {
    if (!AMap || !map) return;
    if (!circleMarker) {
      let instance: AMap.CircleMarker = new AMap.CircleMarker({ ...other });
      map.add(instance);
      setCircleMarker(instance);
      return () => {
        if (instance) {
          if (AMap.v) {
            map && map.remove(instance);
          } else {
            // 暂不使用这个 API，这个不兼容 v1.4.xx，改用 map.remove API
            map && map.removeLayer(instance);
          }
          setCircleMarker(undefined);
        }
      };
    }
  }, [map]);

  useVisible(circleMarker!, visible);
  useSettingProperties<AMap.CircleMarker, UseCircleMarker>(circleMarker!, props, [
    'Center',
    'Radius',
    'zIndex',
    'Bubble',
    'Cursor',
    'StrokeColor',
    'StrokeOpacity',
    'StrokeWeight',
    'FillColor',
    'FillOpacity',
    'Draggable',
    'ExtData',
  ]);
  useEventProperties<AMap.CircleMarkerAllEvents, AMap.CircleMarker>(circleMarker!, props, [
    'onHide',
    'onShow',
    'onClick',
    'onDblClick',
    'onRightClick',
    'onMouseDown',
    'onMouseUp',
    'onMouseOver',
    'onMouseOut',
    'onTouchStart',
    'onTouchMove',
    'onTouchEnd',
  ]);
  return {
    circleMarker,
    setCircleMarker,
  };
};
