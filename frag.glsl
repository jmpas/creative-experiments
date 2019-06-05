varying vec3 vNormal;

void main() {
  vec3 color = vec3( 0.2, 0.2, 0.2 );
  // vec3 color = vec3( 0.15, 0.8, 1.32 );
  // 38, 100, 152

  float diffuse_value1 = 0.00008 * max(dot(vNormal, vec3( -490.0, 29.8, -85.8 ) ), 0.0);
  float diffuse_value2 = 0.00008 * max(dot(vNormal, vec3( -460.0, 40.27, 187.4 ) ), 0.0);
  float diffuse_value3 = 0.00008 * max(dot(vNormal, vec3( 175.5, 30.04, 466.4 ) ), 0.0);
  float diffuse_value4 = 0.00008 * max(dot(vNormal, vec3( 466.0, 45.3, 172.9 ) ), 0.0);
  
  gl_FragColor = vec4( color - (0.1) - 1.0 * vec3( diffuse_value1 + diffuse_value2 + diffuse_value3 + diffuse_value4 ), 0.0 );
}
