/// <reference types="@uiw/react-amap-types" />

import { load } from '@amap/amap-jsapi-loader';
import { FC, Fragment, PropsWithChildren, useEffect, useState } from 'react';

export interface APILoaderConfig {
  /**
   * key 密钥
   * 您需先[申请密钥(ak)](https://lbs.amap.com/dev/key/app)。开发文档说明地址：https://lbs.amap.com/api/javascript-api/guide/abc/prepare
   *
   * 1. 首先，[注册开发者账号](https://lbs.amap.com/dev/id/newuser)，成为高德开放平台开发者
   * 2. 登陆之后，在进入「应用管理」 页面「创建新应用」
   * 3. 为应用[添加 Key](https://lbs.amap.com/dev/key/app)，「服务平台」一项请选择「 Web 端 ( JSAPI ) 」
   *
   */
  key: string;
  /**
   * SDK 包版本，指定要加载的 JSAPI 的版本，缺省时默认为 2.0
   * @default '2.0'
   */
  version?: string;
  /**
   * 加载一个或者多个插件
   * @example `['AMap.ToolBar', 'AMap.Driving']`
   */
  plugins?: AMap.ControlType[];
  /**
   * 是否加载 AMapUI，缺省不加载
   * @default undefined
   */
  AMapUI?: {
    /**
     * AMapUI 缺省 1.1
     * @default "1.1"
     */
    version?: string;
    /** 需要加载的 AMapUI ui插件 */
    plugins?: string[];
  };
  /**
   * 是否加载 Loca， 缺省不加载
   * @default undefined
   */
  Loca?: {
    /**
     * Loca 版本，缺省 1.3.2
     * @default "1.3.2"
     */
    version?: string;
  };
}

export interface APILoaderProps {
  config: APILoaderConfig;
}

const useLoadAMap = (config: APILoaderConfig) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error>();

  useEffect(() => {
    const loadScript = () =>
      load({
        ...config,
        version: config.version || '2.0',
      });
    loadScript()
      .then(() => {
        setError(undefined);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
      });
  }, [config]);

  return { loaded, error };
};

/**
 * APILoader 用于加载高德地图依赖
 */
export const APILoader: FC<PropsWithChildren<APILoaderProps>> = ({ config, children }) => {
  const { loaded, error } = useLoadAMap(config);

  if (error) {
    return <div style={{ color: 'red' }}>{error.message}</div>;
  }

  if (loaded) {
    return <Fragment>{children}</Fragment>;
  }

  return null;
};
