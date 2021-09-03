precision highp float;
precision highp int;
varying vec2 vTextureCoord;

const int MAX_LIGHTS = 128;
uniform sampler2D uSampler;
uniform sampler2D texStaticLights;
uniform vec3 ambientLight;
uniform float staticLightAlpha;
varying vec2 pixelPos;
varying vec2 pixelNPos;
uniform vec2 lightsPos[MAX_LIGHTS];
uniform int lightsCol[MAX_LIGHTS];
uniform int lightQuantity;
uniform float zoom;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main(void) {
    vec4 albedo = texture2D(uSampler, vTextureCoord);
    vec3 statLight = texture2D(texStaticLights, pixelNPos).rgb;
    statLight = rgb2hsv(statLight);
    statLight.z = pow(statLight.z, 1.5 * zoom + 0.7);
    statLight.z *= max((1. - zoom * 0.5), 0.5);
    statLight = hsv2rgb(statLight);
    vec3 light = albedo.rgb * (ambientLight + staticLightAlpha * statLight);
    vec3 dynamicLight = vec3(0.0);
    for(int i = 0; i < MAX_LIGHTS; i++) {

        float magnX = (pixelPos.x - lightsPos[i].x);
        float magnY = (pixelPos.y - lightsPos[i].y);

        if(!((magnX > 600.0) || (magnY > 600.0))) {
            magnX = pow(magnX, 2.0);
            magnY = pow(magnY, 2.0);

            int r = lightsCol[i] / 65536;
            int g = (lightsCol[i] / 256) * 256;
            int b = lightsCol[i] - g;
            g = lightsCol[i] - r * 65536 - b;

            vec3 rgb = vec3(float(r), float(g) / 256.0, float(b)) * 0.00392156862745;

            float magnitude = (magnX + magnY);
            rgb /= (1.0 + 0.027 * sqrt(magnitude) + 0.0028 * magnitude);
            dynamicLight += rgb;
            if(i > lightQuantity)
                break;
        }
    }
    gl_FragColor = vec4(light + dynamicLight, 1.0);
}
