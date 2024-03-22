/// <reference types="@uiw/react-amap-types" />
import { useRef, useEffect, useImperativeHandle, forwardRef, useReducer, FC, PropsWithChildren } from 'react';
import type { MapProps, RenderProps } from './types';
import { useMap } from './useMap';
import { Context, reducer, initialState } from './context';

export * from './useMap';
export * from './context';
export * from './types';

export const Provider: FC<PropsWithChildren<RenderProps>> = (props) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Context.Provider value={{ ...state, state, dispatch }}>{props.children}</Context.Provider>;
};

export const Map = forwardRef<MapProps & { map?: AMap.Map }, MapProps & RenderProps>(
  ({ className, children, ...props }, ref) => {
    const AMap = window.AMap;
    const [, dispatch] = useReducer(reducer, initialState);
    const elmRef = useRef<HTMLDivElement>(null);
    const { setContainer, container, map } = useMap({
      container: props.container || (elmRef.current as MapProps['container']),
      ...props,
    });
    useEffect(() => setContainer(elmRef.current), [elmRef.current]);
    useImperativeHandle(ref, () => ({ ...props, map, AMap, container: props.container || elmRef.current }), [map]);

    useEffect(() => {
      if (map) {
        dispatch({ map, container: elmRef.current, AMap });
      }
    }, [map]);

    return (
      <Provider>
        {!props.container && (
          <div
            ref={elmRef}
            className={className}
            style={{ fontSize: 1, width: '100%', height: '100%', ...props.style }}
          />
        )}
        {AMap && map && typeof children === 'function' && children({ AMap, map, container })}
        {AMap && map && typeof children !== 'function' && children}
      </Provider>
    );
  },
);
