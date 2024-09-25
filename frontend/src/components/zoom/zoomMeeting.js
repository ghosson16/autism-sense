import { ZoomMtg } from '@zoomus/websdk';

ZoomMtg.setZoomJSLib('https://source.zoom.us/2.13.0/lib', '/av');
ZoomMtg.preLoadWasm();
ZoomMtg.prepareJssdk();
