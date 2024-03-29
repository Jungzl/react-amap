import { useState, useLayoutEffect } from 'react';
import { useVisiable, useEventProperties, useSettingProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { CircleProps } from '.';

export interface UseCircle extends CircleProps {}
export const useCircle = (props = {} as UseCircle) => {
  const { visiable, ...other } = props;
  const { map } = useMapContext();
  const [circle, setCircle] = useState<AMap.Circle>();
  useLayoutEffect(() => {
    if (AMap && map && !circle) {
      const instance: AMap.Circle = new AMap.Circle({ ...other });
      map.add(instance);
      setCircle(instance);
      return () => {
        map && map.remove(instance);
        setCircle(undefined);
      };
    }
  }, [map]);

  useVisiable(circle!, visiable);
  useSettingProperties<AMap.Circle, UseCircle>(circle!, props, ['Center', 'Radius', 'Options', 'ExtData']);
  useEventProperties<AMap.CircleAllEvents, AMap.Circle>(circle!, props, [
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
    circle,
    setCircle,
  };
};
