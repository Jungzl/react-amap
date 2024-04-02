import { useState, useEffect } from 'react';
import { useVisible, useEventProperties, useSettingProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { BezierCurveProps } from '.';

export interface UseBezierCurve extends BezierCurveProps {}
export const useBezierCurve = (props = {} as UseBezierCurve) => {
  const { visible, ...other } = props;
  const { map } = useMapContext();
  const [bezierCurve, setBezierCurve] = useState<AMap.BezierCurve>();
  useEffect(() => {
    if (AMap && map && !bezierCurve) {
      let instance: AMap.BezierCurve = new AMap.BezierCurve({ ...other });
      map.add(instance);
      setBezierCurve(instance);
      return () => {
        if (instance) {
          try {
            map && map.remove(instance);
          } catch (e) {
            map && map.removeLayer(instance);
          }
          setBezierCurve(undefined);
        }
      };
    }
  }, [map]);

  useVisible(bezierCurve!, visible);
  useSettingProperties<AMap.BezierCurve, UseBezierCurve>(bezierCurve!, props, [
    'Options',
    'Path',
    'ExtData',
    'ExtData',
  ]);
  useEventProperties<AMap.BezierCurveAllEvents, AMap.BezierCurve>(bezierCurve!, props, [
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
    bezierCurve,
    setBezierCurve,
  };
};
