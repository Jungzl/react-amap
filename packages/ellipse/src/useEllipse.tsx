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
          if (AMap.v) {
            map && map.remove(instance);
          } else {
            // 暂不使用这个 API，这个不兼容 v1.4.xx，改用 map.remove API
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
