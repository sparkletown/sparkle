import * as PIXI from "pixi.js";

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

vec3 PointLightApply(vec2 position, vec3 intencity, vec3 albedo)
{

    float magnX = (pixelPos.x - position.x);
    float magnY = (pixelPos.y - position.y);

    // follow the link down below
    if ((magnX > 400.0) || (magnY > 400.0))
      return vec3(0.0,0.0,0.0);

    magnX *= magnX;
    magnY *= magnY;

    float magnitude = (magnX + magnY);
    // https://wiki.ogre3d.org/tiki-index.php?page=-Point+Light+Attenuation
    albedo *= intencity/(1.0 + 0.027*sqrt(magnitude) + 0.0019*magnitude);

    return albedo;
}

void main(void){
  vec4 albedo = texture2D(uSampler, vTextureCoord);

  vec3 light = albedo.rgb*ambientLight;
  for (int i = 0; i < 256; i++){
    light += PointLightApply(lightsPos[i], lightsCol[i], albedo.rgb);
    if (i >= lightQuantity)
      break;
  }




  gl_FragColor = vec4(light, albedo.w);
}
`;

const mapLightningShader = new PIXI.Filter(vert, frag, {
  ambientLight: [0.15, 0.15, 0.2],
  frame: [0, 0, 9000, 9000],
});
const zoomedLightningShader = new PIXI.Filter(vert, frag, {
  ambientLight: [0.15, 0.15, 0.2],
  frame: [0, 0, 100, 100],
});
export { mapLightningShader, zoomedLightningShader };
