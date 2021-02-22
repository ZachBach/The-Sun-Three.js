uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform samplerCube uPerlin;
uniform vec4 resolution;
varying vec2 vUv;
varying vec3 vPosition;
float PI=3.141592653589793238;

void main(){
    gl_FragColor=textureCube(uPerlin,vPosition);
    gl_FragColor=vec4(vUv,1.,1.);
    gl_FragColor=vec4(1.,0.,1.,1.);
}

