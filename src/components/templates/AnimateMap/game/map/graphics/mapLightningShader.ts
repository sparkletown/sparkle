import * as PIXI from "pixi.js";

import { KeyFramer } from "../../utils/KeyFramer";

const vert = `
attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

uniform vec4 frame;
varying vec2 pixelPos;

vec4 filterVertexPosition( void )
{
    vec2 position = aVertexPosition * max(outputFrame.zw, vec2(0.)) + outputFrame.xy;

    return vec4((projectionMatrix * vec3(position, 1.0)).xy, 0.0, 1.0);
}

vec2 filterTextureCoord( void )
{
    return aVertexPosition * (outputFrame.zw * inputSize.zw);
}

void main(void)
{
    gl_Position = filterVertexPosition();
    vTextureCoord = filterTextureCoord();
    pixelPos = frame.xy + aVertexPosition*frame.zw;
}
`;

const frag = `

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec3 ambientLight;
uniform float maxMagnitude;
uniform vec2 lightPosition;

varying vec2 pixelPos;
uniform vec2 lightsPos[256];
uniform vec3 lightsCol[256];
uniform vec2 koef[256];
uniform int lightQuantity;
//https://stackoverflow.com/questions/15095909/from-rgb-to-hsv-in-opengl-glsl
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 PointLightApply(vec2 position, vec3 intencity, vec3 albedo, vec2 koef)
{

    float magnX = (pixelPos.x - position.x);
    float magnY = (pixelPos.y - position.y);

    // follow the link down below
    if ((magnX > 800.0) || (magnY > 800.0))
      return vec3(0.0,0.0,0.0);

    magnX *= magnX;
    magnY *= magnY;

    float magnitude = (magnX + magnY);
    // https://wiki.ogre3d.org/tiki-index.php?page=-Point+Light+Attenuation
    albedo *= intencity/(1.0 + koef.x*sqrt(magnitude) + koef.y*magnitude);

    return albedo;
}

void main(void){
  vec4 albedo = texture2D(uSampler, vTextureCoord);

  vec3 light = albedo.rgb*ambientLight;
  for (int i = 0; i < 256; i++){
    light += PointLightApply(lightsPos[i], lightsCol[i], albedo.rgb, koef[i]);
    if (i >= lightQuantity)
      break;
  }




  gl_FragColor = vec4(light, albedo.w);
}
`;

const mapLightningShader = new PIXI.Filter(vert, frag, {
  ambientLight: [0.15, 0.15, 0.2],
  frame: [0, 0, 9000, 9000],
  koef: [0.027, 0.0028],
});
const zoomedLightningShader = new PIXI.Filter(vert, frag, {
  ambientLight: [0.15, 0.15, 0.2],
  frame: [0, 0, 100, 100],
  koef: [0.027, 0.0028],
});
export { mapLightningShader, zoomedLightningShader };

export class LightSize extends KeyFramer {
  constructor() {
    super((a: Array<number>, b: Array<number>, size: number) => {
      const l = (b[0] - a[0]) * size + a[0];
      const q = (b[1] - a[1]) * size + a[1];
      return [l, q];
    });

    this.addKey([0.7, 2], 0);
    this.addKey([0.7, 1.8], 7);
    this.addKey([0.35, 0.44], 13);
    this.addKey([0.22, 0.2], 20);
    this.addKey([0.14, 0.07], 32);
    this.addKey([0.09, 0.032], 50);
    this.addKey([0.07, 0.017], 65);
    this.addKey([0.045, 0.0075], 100);
    this.addKey([0.027, 0.0028], 160);
    this.addKey([0.022, 0.0019], 200);
    this.addKey([0.014, 0.0007], 325);
    this.addKey([0.007, 0.0002], 600);
    this.addKey([0.0014, 0.000007], 3250);
    this.addKey([0.0014, 0.000007], Infinity);
  }
}
