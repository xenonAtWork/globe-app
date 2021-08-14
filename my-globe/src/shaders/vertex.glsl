varying vec2 vertexUV;
varying vec3 vertexNormal;

void main() {
    vertexUV = uv; // default from three.js
    vertexNormal = normalize(normalMatrix * normal); // default from three.js
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}