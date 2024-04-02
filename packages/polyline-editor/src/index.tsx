import { forwardRef, useEffect, useImperativeHandle, useContext, useState } from 'react';
import { useEventProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { PolylineContext } from '@uiw/react-amap-polyline';

export interface PolylineEditorProps extends Partial<AMap.PolylineEditor>, AMap.PolylineEditorEvents {
  /** 是否开启编辑功能 */
  active?: boolean;
}

export const PolylineEditor = forwardRef<PolylineEditorProps, PolylineEditorProps>((props, ref) => {
  const { active } = props;
  const { map } = useMapContext();
  const polyline = useContext(PolylineContext);
  const [visible, setVisible] = useState<boolean>(true);
  const [polyEditor, setPolyEditor] = useState<AMap.PolylineEditor>();
  useImperativeHandle(ref, () => ({ ...props, polyEditor }));
  useEffect(() => {
    if (polyline && map && !polyEditor && AMap && AMap.PolylineEditor) {
      const instance = new AMap.PolylineEditor(map, polyline);
      polyline.on('hide', () => setVisible(false));
      polyline.on('show', () => setVisible(true));
      setPolyEditor(instance);
    }
  }, [polyline]);

  useEffect(() => {
    if (!polyEditor) {
      return;
    }
    if (visible && !active && polyline) {
      polyEditor.close();
      props.onEnd && props.onEnd({ type: 'end', target: polyline });
    } else if (visible && active && polyline) {
      polyEditor.open();
      props.onAdd && props.onAdd({ type: 'add', target: polyline });
    } else if (!visible && active && polyline) {
      polyEditor.close();
      props.onEnd && props.onEnd({ type: 'end', target: polyline });
    }
  }, [active, visible, polyline, polyEditor]);

  // @ts-ignore
  useEventProperties<AMap.PolylineEditorAllEvents, AMap.PolylineEditor>(polyEditor!, props, [
    'onEnd',
    'onAddNode',
    'onRemoveNode',
    'onAdjust',
    'onAdd',
  ]);
  return null;
});
