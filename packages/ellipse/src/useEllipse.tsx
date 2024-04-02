import { useState, useLayoutEffect } from 'react';
import { useVisible, useEventProperties, useSettingProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { EllipseProps } from './';

export interface UseEllipse extends EllipseProps {}
export const useEllipse = (props = {} as UseEllipse) => {
  const { visible, ...other } = props;
  const { map } = useMapContext();
  const [ellipse, setEllipse] = useState<AMap.Ellipse>();
  useLayoutEffect(() => {
    if (!AMap || !map) return;
    if (!ellipse) {
      let instance: AMap.Ellipse = new AMap.Ellipse({ ...other });
      map.add(instance);
      setEllipse(instance);
      return () => {
        if (instance) {
          try {
            map && map.remove(instance);
          } catch (e) {
            map && map.removeLayer(instance);
          }
          setEllipse(undefined);
        }
      };
    }
  }, [map]);

  useVisible(ellipse!, visible);
  useSettingProperties<AMap.Ellipse, UseEllipse>(ellipse!, props, ['Center', 'Radius', 'Options', 'ExtData']);
  useEventProperties<AMap.EllipseAllEvents, AMap.Ellipse>(ellipse!, props, [
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
    ellipse,
    setEllipse,
  };
};
