precision highp float;
precision highp int;
varying vec2 vTextureCoord;

const int MAX_LIGHTS = 10;
uniform sampler2D uSampler;

varying vec2 pixelPos;
uniform vec2 lightsPos[MAX_LIGHTS];
uniform int lightsCol[MAX_LIGHTS];
uniform vec2 koef[MAX_LIGHTS];
uniform int lightQuantity;

void main(void) {
    vec4 albedo = texture2D(uSampler, vTextureCoord);
    vec3 light = vec3(0.0, 0.0, 0.0);
    for(int i = 0; i < MAX_LIGHTS; i++) {

        float magnX = (pixelPos.x - lightsPos[i].x);
        float magnY = (pixelPos.y - lightsPos[i].y);

        magnX *= magnX;
        magnY *= magnY;
        int r = lightsCol[i] / 65536;
        int g = (lightsCol[i] / 256) * 256;
        int b = lightsCol[i] - g;
        g = lightsCol[i] - r * 65536 - b;

        vec3 rgb = vec3(float(r), float(g) / 256.0, float(b)) * 0.00392156862745;

        float magnitude = (magnX + magnY);

        rgb /= (1.0 + koef[i].x * sqrt(magnitude) + koef[i].y * magnitude);

        light += rgb;
        if(i > lightQuantity)
            break;
    }

    gl_FragColor = vec4(light + albedo.rgb, 1.0);
}
