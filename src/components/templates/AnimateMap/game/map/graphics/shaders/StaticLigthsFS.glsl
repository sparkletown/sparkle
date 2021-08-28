precision highp float;
precision highp int;
varying vec2 vTextureCoord;

const int MAX_LIGHTS = 10;
uniform sampler2D uSampler;

varying vec2 pixelPos;
uniform mediump vec2 lightsPos[MAX_LIGHTS];
uniform mediump int lightsCol[MAX_LIGHTS];
uniform mediump vec2 koef[MAX_LIGHTS];
uniform int lightQuantity;

void main(void) {
    lowp vec4 albedo = texture2D(uSampler, vTextureCoord);
    lowp vec3 light = vec3(0.0, 0.0, 0.0);
    for(int i = 0; i < MAX_LIGHTS; i++) {

        mediump float magnX = (pixelPos.x - lightsPos[i].x);
        mediump float magnY = (pixelPos.y - lightsPos[i].y);

        magnX *= magnX;
        magnY *= magnY;
        lowp int r = lightsCol[i] / 65536;
        lowp int g = (lightsCol[i] / 256) * 256;
        lowp int b = lightsCol[i] - g;
        g = lightsCol[i] - r * 65536 - b;

        lowp vec3 rgb = vec3(float(r), float(g) / 256.0, float(b)) * 0.00392156862745;

        mediump float magnitude = (magnX + magnY);

        rgb /= (1.0 + koef[i].x * sqrt(magnitude) + koef[i].y * magnitude);

        light += rgb;
        if(i > lightQuantity)
            break;
    }

    gl_FragColor = vec4(light + albedo.rgb, 1.0);
}
