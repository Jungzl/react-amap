import { forwardRef, useEffect, useImperativeHandle, useState, useContext } from 'react';
import { useEventProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { PolygonContext } from '@uiw/react-amap-polygon';

export interface PolygonEditorProps extends Partial<AMap.PolygonEditor>, AMap.PolygonEditorEvents {
  /** 是否开启编辑功能 */
  active?: boolean;
}

export const PolygonEditor = forwardRef<PolygonEditorProps, PolygonEditorProps>((props, ref) => {
  const { active } = props;
  const { map } = useMapContext();
  const polygon = useContext(PolygonContext);
  const [visible, setVisible] = useState<boolean>(true);
  const [polyEditor, setPolyEditor] = useState<AMap.PolygonEditor>();
  useImperativeHandle(ref, () => ({ ...props, polyEditor }));
  useEffect(() => {
    if (polygon && map && !polyEditor && AMap && AMap.PolygonEditor) {
      const instance = new AMap.PolygonEditor(map, polygon);
      polygon.on('hide', () => setVisible(false));
      polygon.on('show', () => setVisible(true));
      setPolyEditor(instance);
    }
  }, [polygon]);

  useEffect(() => {
    if (!polyEditor) {
      return;
    }
    if (visible && !active && polygon) {
      polyEditor.close();
      props.onEnd && props.onEnd({ type: 'end', target: polygon });
    } else if (visible && active && polygon) {
      polyEditor.open();
      props.onAdd && props.onAdd({ type: 'add', target: polygon });
    } else if (!visible && active && polygon) {
      polyEditor.close();
      props.onEnd && props.onEnd({ type: 'end', target: polygon });
    }
  }, [active, visible, polygon]);

  // @ts-ignore
  useEventProperties<AMap.PolygonEditorAllEvents, AMap.PolygonEditor>(polyEditor!, props, [
    'onEnd',
    'onAddNode',
    'onRemoveNode',
    'onAdjust',
    'onMove',
    'onAdd',
  ]);
  return null;
});
