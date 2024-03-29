import { forwardRef, useContext, useEffect, useImperativeHandle, useState } from 'react';
import { useEventProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { PolylineContext } from '@uiw/react-amap-polyline';
import { PolygonContext } from '@uiw/react-amap-polygon';

export interface PolyEditorProps extends Partial<AMap.PolyEditor>, AMap.PolyEditorEvents {
  /** 是否开启编辑功能 */
  active?: boolean;
  polyElement?: AMap.Polygon | AMap.Polyline;
}

export const PolyEditor = forwardRef<PolyEditorProps, PolyEditorProps>((props, ref) => {
  const polyline = useContext(PolylineContext);
  const polygon = useContext(PolygonContext);
  const { active, polyElement = polyline || polygon } = props;
  const { map } = useMapContext();
  const [visiable, setVisiable] = useState<boolean>(true);
  const [polyEditor, setPolyEditor] = useState<AMap.PolyEditor>();
  useImperativeHandle(ref, () => ({ ...props, polyEditor }));
  useEffect(() => {
    if (polyElement && map && !polyEditor && AMap && AMap.PolyEditor) {
      const instance = new AMap.PolyEditor(map, polyElement);
      // @ts-ignore
      polyElement.on('hide', () => setVisiable(false));
      // @ts-ignore
      polyElement.on('show', () => setVisiable(true));
      setPolyEditor(instance);
    }
  }, [polyElement]);

  useEffect(() => {
    if (!polyEditor) {
      return;
    }
    if (visiable && !active) {
      polyEditor.close();
      props.onEnd && props.onEnd({ type: 'end', target: props.polyElement as any });
    } else if (visiable && active) {
      polyEditor.open();
    } else if (!visiable && active) {
      polyEditor.close();
      props.onEnd && props.onEnd({ type: 'end', target: props.polyElement as any });
    }
  }, [active, visiable]);

  // @ts-ignore
  useEventProperties<AMap.PolyEditorAllEvents, AMap.PolyEditor>(polyEditor!, props, [
    'onEnd',
    'onAddNode',
    'onAdjust',
    'onRemoveNode',
  ]);
  return null;
});
