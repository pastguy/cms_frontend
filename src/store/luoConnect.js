import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectReducer from '../utils/injectReducer';
import { Message } from '@alifd/next';

const luoConnect = (va) => {
    let params = va.constructor.name == 'Array' ? va : va.constructor.name == 'String' ? [va] : 0;
    if (!params) throw new Error('参数不对！');
    let luo_module = params.map((item) => {
        let temObj = require(`./${item}`).default;
        if (!temObj) throw new Error('引入的文件地址不对，请检查！');
        return {
            path: item,
            module: temObj,
            namespace: temObj.namespace
        };
    });
    
    return (WrappedComponent) => {
        class Container extends Component {
            constructor(props) {
            super(props);
            }
            render() {
                return (
                    <div>
                        <WrappedComponent {...this.props} />
                    </div>
                );
            }
        }

        const mapDispatchToProps = (dispatch) => {
            return {
                dispatch: (obj) => {
                    let pathArr = obj.type.split('/');
                    let lastPath = pathArr.pop();
                    let listPath = pathArr.pop();
                    let luoModuleObj;
                    for (let i = 0;i < luo_module.length;i++) {
                        if (luo_module[i].namespace == listPath) {luoModuleObj = luo_module[i].module;break;}
                    }
                    if (!luoModuleObj) throw new Error('没有找到模块！');
                    let effectsOrRedusers = luoModuleObj.reducers[lastPath] ? 'reducers' : 'effects';
                    if (effectsOrRedusers == 'effects') {
                        dispatch(async (dispatch) => {
                            luoModuleObj[effectsOrRedusers][lastPath]({payload: obj.payload, callback: obj.callback}, {call: async (api, payload) => {
                              return await api(payload).catch((e) => {
                                if (e.message == 'Network Error') return Message.error('网络错误！');
                                return Message.error('未知错误！');
                              });
                            }, put: dispatch});
                        });
                    } else if (effectsOrRedusers == 'reducers') {
                        dispatch({
                            type: lastPath,
                            isLoading: luoModuleObj.isLoading,
                            payload: obj.payload
                        });
                    }
                }
            }
        }

        const mapStateToProps = (state) => {
            let obj = {};
            luo_module.forEach((item) => {
                obj[item.namespace] = state[item.namespace];
            });
            return obj;
        };

        const withConnect = connect(
            mapStateToProps,
            mapDispatchToProps
        );

        const withLogoutReducers = [];
        luo_module.forEach((item) => {
            withLogoutReducers.push(injectReducer({
                key: item.namespace,
                reducer (state = item.module.state, action) {
                    let temReduser = item.module.reducers[action.type];
                    if (temReduser) {
                    let _state = temReduser(state, action);
                    if (_state) return Object.assign({}, _state, {isLoading: item.module.isLoading});
                    }
                    return Object.assign({},state, {isLoading: item.module.isLoading});
                }
            }));
        });

        return compose(
            ...withLogoutReducers,
            withConnect
        )(Container);
    };
}

export default luoConnect;
