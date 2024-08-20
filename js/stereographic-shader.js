const stereographicVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const stereographicFragmentShader = `
  uniform sampler2D texture;
  varying vec2 vUv;

  void main() {
    vec2 center = vec2(0.5);
    vec2 uv = vUv - center;
    float r = length(uv);
    vec2 uvStereographic = center + uv * (1.0 / (1.0 - r));
    vec4 color = texture2D(texture, uvStereographic);
    gl_FragColor = color;
  }
`;

export { stereographicVertexShader, stereographicFragmentShader };