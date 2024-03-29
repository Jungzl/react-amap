import { useState, useEffect, useLayoutEffect } from 'react';
import { useVisiable, useEventProperties, useSettingProperties, usePortal } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { TextProps } from './';

export interface UseText extends TextProps {}
export const useText = (props = {} as UseText) => {
  const { visiable, ...other } = props;
  const [text, setText] = useState<AMap.Text>();
  const { map } = useMapContext();
  const { container, Portal } = usePortal();
  useLayoutEffect(() => {
    if (!AMap || !map) return;
    if (!text) {
      if (props.children) {
        other.text = container.innerHTML;
      }
      let instance: AMap.Text = new AMap.Text({ ...other });
      map.add(instance);
      setText(instance);
      return () => {
        if (instance) {
          instance.remove();
          setText(undefined);
        }
      };
    }
  }, [map]);

  useEffect(() => {
    if (text) {
      text.setText(props.children ? container.innerHTML : props.text || '');
    }
  }, [props.children, props.text, container, text]);

  useVisiable(text!, visiable);
  useSettingProperties<AMap.Text, UseText>(text!, props, [
    'Style',
    'Title',
    'Clickable',
    'Draggable',
    'Map',
    'Position',
    'Offset',
    'Angle',
    'zIndex',
    'Top',
    'Cursor',
    'ExtData',
  ]);
  useEventProperties<AMap.TextAllEvents, AMap.Text>(text!, props, [
    'onMoving',
    'onTouchMove',
    'onTouchEnd',
    'onMoveAlong',
    'onTouchStart',
    'onMoveEnd',
    'onClick',
    'onDblClick',
    'onRightClick',
    'onMouseMove',
    'onMouseOver',
    'onMouseOut',
    'onMouseDown',
    'onMouseUp',
    'onDragStart',
    'onDragEnd',
    'onDragging',
  ]);
  return {
    text,
    setText,
    TextPortal: Portal,
  };
};
