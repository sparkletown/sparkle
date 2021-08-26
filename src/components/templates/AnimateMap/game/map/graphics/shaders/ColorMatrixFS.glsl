varying vec2 vTextureCoord;

const int MAX_LIGHTS = 128;

uniform sampler2D uSampler;
uniform sampler2D texStaticLights;
uniform vec3 ambientLight;
uniform float staticLightAlpha;
uniform float maxMagnitude;
uniform vec2 lightPosition;
varying vec2 pixelNPos;
varying vec2 pixelPos;
uniform vec2 lightsPos[MAX_LIGHTS];
uniform vec3 lightsCol[MAX_LIGHTS];
uniform vec2 koef[MAX_LIGHTS];
uniform int lightQuantity;

uniform float zoom;

vec3 PointLightApply(vec2 position, vec3 intencity, vec3 albedo, vec2 koef)
{

    float magnX = (pixelPos.x - position.x);
    float magnY = (pixelPos.y - position.y);

    if ((magnX > 800.0) || (magnY > 800.0))
    return vec3(0.0,0.0,0.0);

    magnX *= magnX;
    magnY *= magnY;

    float magnitude = (magnX + magnY);

    albedo *= intencity/(1.0 + koef.x*sqrt(magnitude) + koef.y*magnitude);

    return albedo;
}

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

void main(void){
    lowp vec4 albedo = texture2D(uSampler, vTextureCoord);
    lowp vec3 statLight = texture2D(texStaticLights, pixelNPos).rgb;
    for (int i = 0; i < 3; i++){
        if (statLight[i] > 1.0){
            float div = statLight[i];
            statLight /= div;
        }
    }
    statLight = rgb2hsv(statLight);
    statLight.z = pow(statLight.z, zoom);

    statLight = hsv2rgb(statLight);
    vec3 light = albedo.rgb*ambientLight +  staticLightAlpha*statLight;
    for (int i = 0; i < MAX_LIGHTS; i++){
        light += PointLightApply(lightsPos[i], lightsCol[i], albedo.rgb, koef[i]);
        if (i >= lightQuantity)
        break;
    }


    gl_FragColor = vec4(light, albedo.w);
}
