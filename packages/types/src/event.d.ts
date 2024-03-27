declare namespace AMap {
  type HotspotEventType = 'hotspotclick' | 'hotspotover' | 'hotspotout';

  type BaseMouseEventType =
    | 'click'
    | 'dblclick'
    | 'rightclick'
    | 'mousedown'
    | 'mouseup'
    | 'mouseover'
    | 'mouseout'
    | 'mousemove'
    | 'mousewheel'
    | 'dragstart'
    | 'dragging'
    | 'dragend';

  type TouchEventType = 'touchstart' | 'touchmove' | 'touchend';

  type ViewportEventType =
    | 'zoomstart'
    | 'zoomend'
    | 'zoomchange'
    | 'mapmove'
    | 'movestart'
    | 'moveend'
    | 'hide'
    | 'show';

  type DomEventType = 'resize' | 'complete' | 'open' | 'close';

  type AnimationEventType = 'moving' | 'movealong';

  type DrawEventType = 'draw';

  type POIEventType = 'select' | 'choose';

  type EditorEventType = 'add' | 'end' | 'addnode' | 'adjust' | 'removenode' | 'move';

  type MouseEventType = HotspotEventType | BaseMouseEventType;

  type EventType =
    | MouseEventType
    | TouchEventType
    | ViewportEventType
    | DomEventType
    | AnimationEventType
    | DrawEventType
    | POIEventType
    | EditorEventType;

  interface MapEventAttrs<T extends EventType> {
    /**
     * 事件类型。
     */
    type: T;
    /**
     * 热点的名称。
     */
    name: string;
    /**
     * 热点的唯一标识。
     */
    id: string;
    /**
     * 发生事件时光标所在处的经纬度坐标。
     */
    lnglat: LngLat;
    /**
     * 发生事件时光标所在处的像素坐标。
     */
    pixel: Pixel;
    pos: Vector2;
    /**
     * 事件触发时的轨迹点索引。
     */
    index: number;
    /**
     * 事件触发时的轨迹路径。
     */
    passedPath: [...Vector2[], LngLat];
    /**
     * 事件触发时的轨迹点坐标。
     */
    passedPos: Vector2;
    /**
     * 事件触发时的轨迹动画进度 0-1。
     */
    progress: number;
    /**
     * 触发事件的POI对象。
     */
    poi: POI;
  }

  interface MapEventOriginEvent<T extends MouseEvent | TouchEvent> {
    /**
     * 原始事件对象。
     */
    originEvent: T;
  }

  interface MapEventTarget<T extends MapEventListener> {
    /**
     * 发生事件的目标对象，不同类型返回target不同。例如，事件对象是Marker，则target表示目标对象为Marker，事件对象是其他，则随之改变。
     */
    target: T;
  }

  interface MapEventObj {
    /**
     * 绘制的矢量图形对象。
     */
    obj: Polyline | Polygon | Rectangle | Circle;
  }

  type HotspotEventObj<T extends EventType> = Pick<MapEventAttrs<T>, 'type' | 'lnglat' | 'id' | 'name'> &
    MapEventOriginEvent<MouseEvent>;

  type BaseMouseEventObj<T extends EventType, U extends MapEventListener> = Pick<
    MapEventAttrs<T>,
    'type' | 'lnglat' | 'pixel' | 'pos'
  > &
    MapEventOriginEvent<MouseEvent> &
    MapEventTarget<U>;

  type TouchEventObj<T extends EventType, U extends MapEventListener> = Pick<
    MapEventAttrs<T>,
    'type' | 'lnglat' | 'pixel' | 'pos'
  > &
    MapEventOriginEvent<TouchEvent> &
    MapEventTarget<U>;

  type ViewportEventObj<T extends EventType, U extends MapEventListener> = Pick<MapEventAttrs<T>, 'type'> &
    MapEventTarget<U>;

  type DomEventObj<T extends EventType> = Pick<MapEventAttrs<T>, 'type'>;

  type AnimationEventObj<T extends EventType, U extends MapEventListener> = Pick<
    MapEventAttrs<T>,
    'type' | 'pos' | 'index' | 'passedPath' | 'passedPos' | 'progress'
  > &
    MapEventTarget<U>;

  type DrawEventObj<T extends EventType> = Pick<MapEventAttrs<T>, 'type'> & MapEventObj;

  type POIEventObj<T extends EventType> = Pick<MapEventAttrs<T>, 'type' | 'poi'>;

  type EditorEventObj<T extends EventType, U extends MapEventListener> = Pick<
    MapEventAttrs<T>,
    T extends 'add' | 'end' ? 'type' : 'type' | 'lnglat' | 'pixel'
  > &
    MapEventTarget<U>;

  abstract class EventEmitter {
    /**
     * 注册事件
     * @param eventName 事件名称
     * @param handler 事件回调函数
     * @param context 事件回调中的上下文
     * @param once 触发一次
     * @param unshift 更改事件顺序
     */
    on<C = this>(
      eventName: string,
      handler: (this: C, event: any) => void,
      context?: C,
      once?: boolean,
      unshift?: boolean,
    ): this;
    /**
     * 移除事件绑定
     * @param eventName 事件名称
     * @param handler 事件功能函数
     * @param context 事件上下文
     */
    off<C = this>(eventName: string, handler: ((this: C, event: any) => void) | 'mv', context?: C): this;
    /**
     * 触发事件
     * @param eventName 事件名称
     * @param data 事件数据
     */
    emit(eventName: string, data?: any): this;
  }
  namespace event {
    interface EventListener<T extends 0 | 1> {
      type: T;
    }
    /**
     * 注册DOM对象事件
     * @param instance 需注册事件的DOM对象
     * @param eventName 事件名称
     * @param handler 事件功能函数
     * @param context 事件上下文
     */
    function addDomListener<
      N extends keyof HTMLElementTagNameMap,
      E extends keyof HTMLElementEventMap,
      C = HTMLElementTagNameMap[N],
    >(
      // tslint:disable-next-line: no-unnecessary-generics
      instance: HTMLElementTagNameMap[N],
      eventName: E,
      handler: (this: C, event: HTMLElementEventMap[E]) => void,
      context?: C,
    ): EventListener<0>;
    /**
     * 给对象注册事件
     * @param instance 需注册事件的对象
     * @param eventName 事件名称
     * @param handler 事件功能函数
     * @param context 事件上下文
     */
    function addListener<I extends EventEmitter, C = I>(
      // tslint:disable-next-line: no-unnecessary-generics
      instance: I,
      eventName: string,
      handler: (this: C, event: any) => void,
      context?: C,
    ): EventListener<1>;
    /**
     * 给对象注册一次性事件
     * @param instance 需注册事件的对象
     * @param eventName 事件名称
     * @param handler 事件功能函数
     * @param context 事件上下文
     */
    function addListenerOnce<I extends EventEmitter, C = I>(
      // tslint:disable-next-line: no-unnecessary-generics
      instance: I,
      eventName: string,
      handler: (this: C, event: any) => void,
      context?: C,
    ): EventListener<1>;
    /**
     * 删除事件
     * @param listener 侦听器
     */
    function removeListener(listener: EventListener<0 | 1>): void;
    /**
     * 触发非DOM事件
     * @param instance 触发对象
     * @param eventName 事件名称
     * @param data 事件数据
     */
    function trigger(instance: EventEmitter, eventName: string, data?: any): void;
  }
}
