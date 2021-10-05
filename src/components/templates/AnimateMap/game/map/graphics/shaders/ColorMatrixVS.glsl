attribute vec2 aVertexPosition;

uniform mat3 projectionMatrix;

varying vec2 vTextureCoord;

uniform vec4 inputSize;
uniform vec4 outputFrame;

uniform vec4 frame;
varying vec2 pixelPos;
varying vec2 pixelNPos;
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
    pixelNPos = (frame.xy + aVertexPosition*frame.zw)/9920.;
}
