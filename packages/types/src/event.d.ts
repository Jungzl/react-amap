declare namespace AMap {
  class MapEventListener<T extends EventType> {
    /**
     * 设置控件可见
     */
    show: () => void;
    /**
     * 设置控件隐藏
     */
    hide: () => void;
    /**
     * 给实例绑定事件回调函数，同一个类型、同一个回调函数、同一个上下文只会绑定一次
     * @param event {String} 事件类型
     * @param handler {Function} 回调函数
     * @param context {Object} 事件上下文，缺省为实例本身
     * @param once {Boolean} 是否只执行一次
     * @returns {Object} 当前实例
     */
    on<U extends T>(event: Lowercase<U>, handler: MapEvent<U>, context?: this, once?: boolean): this;
    /**
     * 移除当前实例的某一个事件回调
     * @param event {String} 事件类型
     * @param handler {Function} 事件回调函数
     * @param context {Object} 事件上下文，缺省为当前实例
     * @returns {Object} 当前实例
     */
    off<U extends T>(event: Lowercase<U>, handler: MapEvent<U>, context?: this): this;
    /**
     * 判断当前实例是否已经绑定了某个事件回调
     * @param type {String} 事件类型
     * @param handler {Function}  事件回调
     * @param context {Object} 事件上下文
     */
    hasEvents<U extends T>(type: U, handler: (...args: any[]) => void, context?: this): boolean;
    /**
     * 清除当前实例某一类型的全部事件回调
     * @param type {String} 事件类型，如果此参数为空，清除实例上的所有绑定的事件回调
     * @returns {Object} 当前实例
     */
    clearEvents<U extends T>(type?: U): this;
    /**
     * 模拟触发当前实例的某个事件
     * @param type {String} 事件类型
     * @param data {any} 事件回调时返回的数据，模拟的事件体应该完整，否则可能导致报错
     * @returns {Object} 当前实例
     */
    emit<U extends T>(type: U, data: any): this;
    /**
     * 获取当前实例所有已绑定的事件
     */
    getEvents(): {
      [U in T]?: { fn: MapEvent<U>; context: this; once: boolean }[];
    };
  }

  type HotspotEventType = 'hotspotClick' | 'hotspotOver' | 'hotspotOut';

  type BaseMouseEventType =
    | 'click'
    | 'dblClick'
    | 'rightClick'
    | 'mouseDown'
    | 'mouseUp'
    | 'mouseOver'
    | 'mouseOut'
    | 'mouseMove'
    | 'mouseWheel'
    | 'dragStart'
    | 'dragging'
    | 'dragEnd';

  type TouchEventType = 'touchStart' | 'touchMove' | 'touchEnd';

  type ViewportEventType =
    | 'zoomStart'
    | 'zoomEnd'
    | 'zoomChange'
    | 'mapMove'
    | 'moveStart'
    | 'moveEnd'
    | 'hide'
    | 'show';

  type DomEventType = 'resize' | 'complete' | 'open' | 'close';

  type AnimationEventType = 'moving' | 'moveAlong';

  type DrawEventType = 'draw';

  type POIEventType = 'select' | 'choose';

  type EditorEventType = 'add' | 'end' | 'addNode' | 'adjust' | 'removeNode' | 'move';

  /**
   * 地图事件类型。
   */
  type EventType =
    | HotspotEventType
    | BaseMouseEventType
    | TouchEventType
    | ViewportEventType
    | DomEventType
    | AnimationEventType
    | DrawEventType
    | POIEventType
    | EditorEventType;

  /**
   * 地图事件属性。
   */
  interface MapEventAttrs<T extends EventType> {
    /**
     * 事件类型。
     */
    type: Lowercase<T>;
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

  /**
   * 地图事件原始事件对象。
   */
  interface MapEventOriginEvent<T extends MouseEvent | TouchEvent> {
    /**
     * 原始事件对象。
     */
    originEvent: T;
  }

  /**
   * 地图事件目标对象。
   */
  interface MapEventTarget<T extends MapEventListener> {
    /**
     * 发生事件的目标对象，不同类型返回target不同。例如，事件对象是Marker，则target表示目标对象为Marker，事件对象是其他，则随之改变。
     */
    target: T;
  }

  /**
   * 地图事件绘制的覆盖物对象。
   */
  interface MapEventObj {
    /**
     * 绘制的矢量图形对象。
     */
    obj: Polyline | Polygon | Rectangle | Circle | Marker;
  }

  /**
   * 热点事件对象。
   */
  type HotspotEventObj<T extends EventType> = Pick<MapEventAttrs<T>, 'type' | 'lnglat' | 'id' | 'name'> &
    MapEventOriginEvent<MouseEvent>;

  /**
   * 基础鼠标事件对象。
   */
  type BaseMouseEventObj<T extends EventType, U extends MapEventListener> = Pick<
    MapEventAttrs<T>,
    'type' | 'lnglat' | 'pixel' | 'pos'
  > &
    MapEventOriginEvent<MouseEvent> &
    MapEventTarget<U>;

  /**
   * 触摸事件对象。
   */
  type TouchEventObj<T extends EventType, U extends MapEventListener> = Pick<
    MapEventAttrs<T>,
    'type' | 'lnglat' | 'pixel' | 'pos'
  > &
    MapEventOriginEvent<TouchEvent> &
    MapEventTarget<U>;

  /**
   * 视口事件对象。
   */
  type ViewportEventObj<T extends EventType, U extends MapEventListener> = Pick<MapEventAttrs<T>, 'type'> &
    MapEventTarget<U>;

  /**
   * DOM事件对象。
   */
  type DomEventObj<T extends EventType> = Pick<MapEventAttrs<T>, 'type'>;

  /**
   * 动画事件对象。
   */
  type AnimationEventObj<T extends EventType, U extends MapEventListener> = Pick<
    MapEventAttrs<T>,
    'type' | 'pos' | 'index' | 'passedPath' | 'passedPos' | 'progress'
  > &
    MapEventTarget<U>;

  /**
   * 绘制事件对象。
   */
  type DrawEventObj<T extends EventType> = Pick<MapEventAttrs<T>, 'type'> & MapEventObj;

  /**
   * POI事件对象。
   */
  type POIEventObj<T extends EventType> = Pick<MapEventAttrs<T>, 'type' | 'poi'>;

  /**
   * 编辑事件对象。
   */
  type EditorEventObj<T extends EventType, U extends MapEventListener> = Pick<
    MapEventAttrs<T>,
    T extends 'add' | 'end' ? 'type' : 'type' | 'lnglat' | 'pixel'
  > &
    MapEventTarget<U>;

  /**
   * 地图事件对象。
   */
  type MapsEvent<T extends EventType, U extends MapEventListener = Map> = T extends BaseMouseEventType
    ? BaseMouseEventObj<T, U>
    : T extends TouchEventType
      ? TouchEventObj<T, U>
      : T extends HotspotEventType
        ? HotspotEventObj<T>
        : T extends ViewportEventType
          ? ViewportEventObj<T, U>
          : T extends DomEventType
            ? DomEventObj<T>
            : T extends AnimationEventType
              ? AnimationEventObj<T, U>
              : T extends DrawEventType
                ? DrawEventObj<T>
                : T extends POIEventType
                  ? POIEventObj<T>
                  : T extends EditorEventType
                    ? EditorEventObj<T, U>
                    : never;

  /**
   * 地图事件转换为属性。
   * @example
   * ```ts
   * type Props = EventToProp<'click'>; // 'onClick'
   * ```
   */
  type EventToProp<T extends EventType> = `on${Capitalize<T>}`;

  /**
   * 属性转换为地图事件。
   * @example
   * ```ts
   * type Event = EventFromProp<'onClick'>; // 'click'
   * ```
   */
  type EventFromProp<T extends EventToProp<EventType>> = T extends `on${infer U}` ? Uncapitalize<U> : never;

  /**
   * 地图事件回调函数。
   * @example
   * ```ts
   * const handleClick: MapEvent<'click'> = (event) => {
   *   console.log(event);
   *   // do something
   * };
   * ```
   */
  type MapEvent<T extends EventType, U extends MapEventListener = Map> = (event: MapsEvent<T, U>) => void;

  /**
   * 地图事件属性。
   * @example
   * ```ts
   * type Props = MapEventProps<'click'>; // { onClick?: MapEvent<'click'> }
   * ```
   */
  type MapEventProps<T extends EventType, U extends MapEventListener = Map> = {
    [K in EventToProp<T>]?: MapEvent<EventFromProp<K>, U>;
  };

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
