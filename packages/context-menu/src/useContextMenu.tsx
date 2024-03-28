import { useState, useEffect } from 'react';
import { useEventProperties } from '@uiw/react-amap-utils';
import { useMapContext } from '@uiw/react-amap-map';
import { ContextMenuProps } from '.';

export interface UseContextMenu extends ContextMenuProps {}
export const useContextMenu = (props = {} as UseContextMenu) => {
  const { position, ...other } = props;
  const { map } = useMapContext();
  const [contextMenu, setContextMenu] = useState<AMap.ContextMenu>();
  useEffect(() => {
    if (!AMap || !map) return;
    if (!contextMenu) {
      let instance: AMap.ContextMenu = new AMap.ContextMenu({ ...other });
      setContextMenu(instance);
      const rightClick = ((event: AMap.MapsEvent<'rightClick'>) =>
        instance.open(map, position || event.lnglat)) as AMap.MapEvent<AMap.EventType>;
      map.on('rightclick', rightClick);
      return () => {
        if (instance) {
          instance.close();
          map.off('rightclick', rightClick);
          setContextMenu(undefined);
        }
      };
    }
  }, [map]);
  useEventProperties<'open' | 'close'>(contextMenu!, props, ['onOpen', 'onClose']);
  return {
    contextMenu,
    setContextMenu,
  };
};
