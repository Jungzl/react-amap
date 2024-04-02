import { useState, useLayoutEffect } from 'react';
import { useVisible, useEventProperties, useSettingProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { CircleProps } from '.';

export interface UseCircle extends CircleProps {}
export const useCircle = (props = {} as UseCircle) => {
  const { visible, ...other } = props;
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

  useVisible(circle!, visible);
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
