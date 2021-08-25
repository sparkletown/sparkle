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

void main(void){
    vec4 albedo = texture2D(uSampler, vTextureCoord);

    vec3 light = albedo.rgb*ambientLight + staticLightAlpha*texture2D(texStaticLights, pixelNPos).rgb;
    for (int i = 0; i < MAX_LIGHTS; i++){
        light += PointLightApply(lightsPos[i], lightsCol[i], albedo.rgb, koef[i]);
        if (i >= lightQuantity)
        break;
    }


    gl_FragColor = vec4(light, albedo.w);
}
