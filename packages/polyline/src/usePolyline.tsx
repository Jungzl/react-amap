import { useEffect, useLayoutEffect, useState } from 'react';
import { useVisible, useEventProperties, useSettingProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { PolylineProps } from '.';

export interface UsePolyline extends PolylineProps {}

export function usePolyline(props = {} as UsePolyline) {
  const [polyline, setPolyline] = useState<AMap.Polyline>();
  const { visible, ...other } = props;
  const { map } = useMapContext();
  useLayoutEffect(() => {
    if (map && !polyline) {
      const instance: AMap.Polyline = new AMap.Polyline(other);
      map.add(instance);
      setPolyline(instance);
      return () => {
        if (instance) {
          try {
            map && map.remove(instance);
          } catch (e) {}
          // if (AMap.v) {
          //   map && map.remove(polyline);
          // } else {
          //   // 暂不使用这个 API，这个不兼容 v1.4.xx，改用 map.remove API
          //   map && map.removeLayer(polyline);
          // }
          setPolyline(undefined);
        }
      };
    }
  }, [map]);

  useEffect(() => {
    if (polyline) {
      polyline.setOptions(other);
    }
  }, [polyline, other]);

  useVisible(polyline!, visible);
  useSettingProperties<AMap.Polyline, UsePolyline>(polyline!, props, [
    'Path',
    'Options',
    'Map',
    'ExtData',
    'Draggable',
  ]);
  useEventProperties<AMap.PolylineAllEvents, AMap.Polyline>(polyline!, props, [
    'onHide',
    'onShow',
    'onMouseOut',
    'onRightClick',
    'onDblClick',
    'onMouseDown',
    'onClick',
    'onMouseOver',
    'onTouchEnd',
    'onTouchMove',
    'onTouchStart',
    'onMouseUp',
  ]);
  return {
    polyline,
    setPolyline,
  };
}
