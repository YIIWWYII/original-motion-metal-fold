export const fragment = `precision highp float;
uniform vec2 resolution;uniform float time;
#define PI 3.14159265
mat2 rot(float a){return mat2(cos(a),-sin(a),sin(a),cos(a));}
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
vec3 env(vec3 d){float soft=pow(max(0.,dot(d,normalize(vec3(-.5,1.,1.)))),8.);float strip=pow(max(0.,1.-abs(d.x*.7+d.y*.3-.35)),65.);float rim=pow(max(0.,dot(d,normalize(vec3(1.,-.2,-.4)))),20.);return vec3(.025,.04,.07)+soft*vec3(.55,.7,.9)+strip*vec3(3.)+rim*vec3(.9,.34,.12);}

float field(vec3 p){p.xy=rot(.23*sin(time*.7854))*p.xy;p.xz=rot(time*.7854)*p.xz;float a=atan(p.y,p.x),r=length(p.xy);float wave=.20*sin(a*5.+time*1.5708)+.12*sin(a*9.-time*.7854);float band=length(vec2(r-(1.16+wave),p.z-.35*sin(a*3.+time*.7854)));return band-(.21+.045*cos(a*7.+time*1.5708));}
vec3 normal(vec3 p){vec2 e=vec2(.002,0.);return normalize(vec3(field(p+e.xyy)-field(p-e.xyy),field(p+e.yxy)-field(p-e.yxy),field(p+e.yyx)-field(p-e.yyx)));}
void main(){vec2 uv=(gl_FragCoord.xy-.5*resolution)/resolution.y;vec3 ro=vec3(0.,.05,4.7),rd=normalize(vec3(uv,-1.35));float travel=0.;vec3 p;bool hit=false;for(int i=0;i<150;i++){p=ro+rd*travel;float d=field(p);if(d<.0015){hit=true;break;}travel+=d*.30;if(travel>8.)break;}vec3 col=vec3(.022,.028,.04)*(1.-length(uv)*.3);col+=vec3(.055,.07,.09)*exp(-5.*length(uv-vec2(0.,.03)));if(hit){vec3 n=normal(p),ref=reflect(rd,n);float f=pow(1.-max(0.,dot(n,-rd)),3.);col=env(ref)*(.65+.5*f);col+=vec3(.07,.13,.19)*max(0.,dot(n,normalize(vec3(-1.,1.,2.))));col*=.70+.30*smoothstep(-.45,.5,p.z);col+=vec3(.8,.9,1.)*pow(max(dot(ref,normalize(vec3(.7,1.,2.))),0.),100.)*2.;}col=col/(1.+col);col=pow(col,vec3(.4545));col+= (hash(gl_FragCoord.xy)-.5)/255.;gl_FragColor=vec4(col,1.);}
`;
