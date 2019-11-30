//It's a camera
class Camera
{
	//Initialize this camera so that its combined matrix is the identity matrix
	constructor()
	{
		this.position = new Vector3();
		this.direction = new Vector3();
		this.up = new Vector3(); //AKA tilt
		this.reset();
		
		this.projection = new Matrix4(); //You must set this yourself with setOrthographic or setPerspective on viewport/canvas resize
	}
	
	lookAt(at)
	{
		this.direction.set(at).sub(this.position);
	}
	
	//Multiply projection and view matrices together to get the combined camera matrix (for Shader subclasses)
	calculateMatrix(out)
	{
		__gljs_tmpMat1.setView(this.position, this.direction, this.up);
		return out.set(this.projection).mul(__gljs_tmpMat1);
	}
	
	//Reset the view matrix to the identity matrix (leaves projection untouched)
	reset()
	{
		this.position.set(V0);
		this.direction.set(VNZ);
		this.up.set(VY);
	}
}

//Singular point on a mesh and its attributes
class Vertex
{
	//Initialize this vertex with the position/normal/texture attributes, another vertex, or unset if no args were passed
	constructor(position, normal, u, v)
	{
		if(position instanceof Vertex)
		{
			this.position = new Vector3(position.position);
			this.normal = new Vector3(position.normal);
			this.u = position.u;
			this.v = position.v;
		}
		else
		{
			this.position = new Vector3(position);
			this.normal = new Vector3(normal);
			this.u = u || 0;
			this.v = v || 0;
		}
	}
}

//It's a texture. Must be disposed with .dispose()
class Texture
{
	//Last 4 args are optional and correspond to GL texture parameters
	//Data can either be a URL or typed array
	//If data is an array you must specify width/height
	//If data is a URL then width/height is ignored; also you can add an .onload() function to the texture object
	constructor(gl, data, width, height, minFilter, magFilter, wrapS, wrapT)
	{
		var id = gl.createTexture();
		var w;
		var h;
		
		gl.bindTexture(gl.TEXTURE_2D, id);
		
		if(typeof data === "string")
		{
			var dataLoad = new Uint8Array( //checkerboard loading pattern while waiting for file to download
			[
				255, 255, 255, 255,
				  0,   0,   0, 255,
				  0,   0,   0, 255,
				255, 255, 255, 255
			]);
			
			w = 2;
			h = 2;
			
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, dataLoad);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS || gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT || gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
			
			var img = new Image();
			img.onload = (function()
			{
				w = img.width;
				h = img.height;
				
				gl.bindTexture(gl.TEXTURE_2D, id);
				gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter || gl.LINEAR);
				gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter || gl.LINEAR);
				gl.generateMipmap(gl.TEXTURE_2D);
				
				if(this.onload) this.onload();
			}).bind(this);
			
			img.src = data;
		}
		else
		{
			w = width;
			h = height;
			
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS || gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT || gl.REPEAT);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter || gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter || gl.LINEAR);
			gl.generateMipmap(gl.TEXTURE_2D);
		}
		
		//Bind this texture. Built-in shaders will do this for you
		this.bind = function(active)
		{
			gl.activeTexture(gl.TEXTURE0 + active);
			gl.bindTexture(gl.TEXTURE_2D, id);
		};
		
		//Underlying WebGLTexture object
		this.getID = function()
		{
			return id;
		};
		
		this.getWidth = function()
		{
			return w;
		};
		
		this.getHeight = function()
		{
			return h;
		};
		
		this.dispose = function()
		{
			gl.deleteTexture(id);
		};
	}
}

//Describes how a Mesh is drawn
//http://tinyurl.com/phongdiagram
class Material
{
	constructor()
	{
		this.ambientColor = new Color(COLOR_WHITE);
		this.ambientTexture = null;
		this.ambientTextureEnable = false;
		
		this.diffuseColor = new Color(COLOR_WHITE);
		this.diffuseTexture = null;
		this.diffuseTextureEnable = false;
		
		this.specularColor = new Color(COLOR_WHITE);
		this.specularTexture = null;
		this.specularTextureEnable = false;
		this.specularShine = 128; //shininess exponent (higher=more concentrated)
	}
}

//Collection of vertices to be rendered. Must be disposed with .dispose()
class Mesh
{
	//Vertices is an array of vertices (Vertex class)
	//Indices is an array of integers. Uint32Array is faster than a regular array
	constructor(gl, vertices, indices)
	{
		var VAO = gl.createVertexArray();
		var VBO = gl.createBuffer();
		var EBO = gl.createBuffer();
		
		var floatSize = 4; //sizeof float in VRAM
		var vertexAttCnt = 8; //number of vertex attributes per vertex
		var vertexSize = floatSize * vertexAttCnt; //sizeof single vertex in VRAM
		
		var vertexData = new Float32Array(vertices.length * vertexAttCnt);
		for(var i = 0; i < vertices.length; i++)
		{
			var vi = i * vertexAttCnt;
			vertexData[vi    ] = vertices[i].position.x;
			vertexData[vi + 1] = vertices[i].position.y;
			vertexData[vi + 2] = vertices[i].position.z;
			vertexData[vi + 3] = vertices[i].normal.x;
			vertexData[vi + 4] = vertices[i].normal.y;
			vertexData[vi + 5] = vertices[i].normal.z;
			vertexData[vi + 6] = vertices[i].u;
			vertexData[vi + 7] = vertices[i].v;
		}
		
		var indexData = indices instanceof Uint32Array ? indices : new Uint32Array(indices);
		
		gl.bindVertexArray(VAO);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
		gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
		var vlength = vertices.length;
		
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexData, gl.STATIC_DRAW);
		var ilength = indices.length;
		
		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, vertexSize, 0);
		gl.vertexAttribPointer(1, 3, gl.FLOAT, false, vertexSize, 3 * floatSize);
		gl.vertexAttribPointer(2, 2, gl.FLOAT, false, vertexSize, 6 * floatSize);
		
		gl.enableVertexAttribArray(0);
		gl.enableVertexAttribArray(1);
		gl.enableVertexAttribArray(2);
		
		//Bind this mesh. Built-in shaders will do this for you
		this.bind = function()
		{
			gl.bindVertexArray(VAO);
		};
		
		//Vertex array object
		this.getVAO = function()
		{
			return VAO;
		};
		
		//Vertex buffer object
		this.getVBO = function()
		{
			return VBO;
		};
		
		//Element (index) buffer object
		this.getEBO = function()
		{
			return EBO;
		};
		
		//Number of vertices
		this.getVertexLength = function()
		{
			return vlength;
		};
		
		//Number of indices
		this.getIndexLength = function()
		{
			return ilength;
		};
		
		this.dispose = function()
		{
			gl.deleteBuffer(EBO);
			gl.deleteBuffer(VBO);
			gl.deleteVertexArray(VAO);
		};
	}
}

//Combination of Material and Mesh. Smallest renderable unit
class MatMesh
{
	constructor(material, mesh)
	{
		this.material = material;
		this.mesh = mesh;
	}
}

//List of matmeshes and their world transform
class Model
{
	constructor(...matmesh)
	{
		this.data = matmesh || [];
		this.transform = new Matrix4();
	}
}

//Renderer superclass. Must be disposed with .dispose()
class Shader
{
	//Compile a shader program from GLSL source. Set debug to true to see compiler logs in console
	constructor(gl, vertex, fragment, debug)
	{
		var vertexShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertexShader, vertex);
		gl.compileShader(vertexShader);
		
		var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragmentShader, fragment);
		gl.compileShader(fragmentShader);
		
		if(debug)
		{
			console.log("VERTEX SHADER COMPILATION LOG:");
			console.log(gl.getShaderInfoLog(vertexShader));
			
			console.log("FRAGMENT SHADER COMPILATION LOG:");
			console.log(gl.getShaderInfoLog(fragmentShader));
		}
		
		var id = gl.createProgram();
		gl.attachShader(id, vertexShader);
		gl.attachShader(id, fragmentShader);
		gl.linkProgram(id);
		gl.deleteShader(vertexShader);
		gl.deleteShader(fragmentShader);
		
		//Bind this shader. Required if you have multiple shaders
		this.use = function()
		{
			gl.useProgram(id);
		};
		
		//Underlying WebGLShader object
		this.getID = function()
		{
			return id;
		};
		
		//Return the location of a named uniform
		this.getUniform = function(name)
		{
			return gl.getUniformLocation(id, name);
		};
		
		this.setUniformBool = function(name, b)
		{
			if(typeof name === "string")
				gl.uniform1i(this.getUniform(name), b ? 1 : 0);
			else
				gl.uniform1i(name, b ? 1 : 0);
		};
		
		this.setUniformInt = function(name, i)
		{
			if(typeof name === "string")
				gl.uniform1i(this.getUniform(name), i);
			else
				gl.uniform1i(name, i);
		};
		
		this.setUniformFloat = function(name, f)
		{
			if(typeof name === "string")
				gl.uniform1f(this.getUniform(name), f);
			else
				gl.uniform1f(name, f);
		};
		
		this.setUniformVector3 = function(name, vec)
		{
			if(typeof name === "string")
				gl.uniform3f(this.getUniform(name), vec.x, vec.y, vec.z);
			else
				gl.uniform3f(name, vec.x, vec.y, vec.z);
		};
		
		this.setUniformColor = function(name, col)
		{
			if(typeof name === "string")
				gl.uniform4f(this.getUniform(name), col.r, col.g, col.b, col.a);
			else
				gl.uniform4f(name, col.r, col.g, col.b, col.a);
		};
		
		this.setUniformMatrix4 = function(name, mat, transpose)
		{
			if(typeof name === "string")
				gl.uniformMatrix4fv(this.getUniform(name), transpose, mat.val);
			else
				gl.uniformMatrix4fv(name, transpose, mat.val);
		};
		
		this.setUniformFloatArray = function(name, arr)
		{
			if(typeof name === "string")
				gl.uniform1fv(this.getUniform(name), arr);
			else
				gl.uniform1fv(name, arr);
		};
		
		this.dispose = function()
		{
			gl.deleteProgram(id);
		};
	}
}

//Global light source meant to simulate the sun
class DirectionalLight
{
	constructor()
	{
		this.direction = new Vector3(VNY);
		this.ambient   = new Vector3(0.3, 0.3, 0.3);
		this.diffuse   = new Vector3(V1);
		this.specular  = new Vector3(0.5, 0.5, 0.5);
	}
}

//Localized light source
class PointLight
{
	constructor()
	{
		this.position = new Vector3();
		this.ambient   = new Vector3(0.3, 0.3, 0.3);
		this.diffuse   = new Vector3(V1);
		this.specular  = new Vector3(0.5, 0.5, 0.5);
		
		this.attenuationConstant  = 1;
		this.attenuationLinear    = 0;
		this.attenuationQuadratic = 0;
	}
}

//Spotlight or flashlight
class SpotLight
{
	constructor()
	{
		this.position  = new Vector3();
		this.direction = new Vector3();
		this.ambient   = new Vector3(0.3, 0.3, 0.3);
		this.diffuse   = new Vector3(V1);
		this.specular  = new Vector3(0.5, 0.5, 0.5);
		
		this.attenuationConstant  = 1;
		this.attenuationLinear    = 0;
		this.attenuationQuadratic = 0;
		
		this.innerCutOff = Math.cos(7.5 * DEGRAD);
		this.outerCutOff = Math.cos(15  * DEGRAD);
	}
}

//Shader that implements Phong shading. Must be disposed with .dispose()
class DefaultShader extends Shader
{
	constructor(gl, maxPointLights = 8, maxSpotLights = 8)
	{
		var vertexShaderSource =
		`#version 300 es
		precision highp float;
		
		layout(location = 0) in vec3 aPos;
		layout(location = 1) in vec3 aNormal;
		layout(location = 2) in vec2 aTexuv;
		
		uniform mat4 camMat, norMat, traMat;
		
		out vec3 vpos;
		out vec3 normal;
		out vec2 texuv;
		
		void main()
		{
			vec4 vpos4 = traMat * vec4(aPos, 1.0);
			
			vpos = vpos4.xyz;
			normal = normalize(mat3(norMat) * aNormal);
			texuv = aTexuv;
			
			gl_Position = camMat * vpos4;
		}`;
		
		var fragmentShaderSource =
		`#version 300 es
		precision highp float;
		
		#define POINTLIGHTS ${maxPointLights}
		#define SPOTLIGHTS ${maxSpotLights}
		
		struct DirectionalLight
		{
			bool en;
			vec3 dir;
			
			vec3 amb;
			vec3 diff;
			vec3 spec;
		};
		
		struct PointLight
		{
			bool en;
			vec3 pos;
			
			vec3 amb;
			vec3 diff;
			vec3 spec;
			
			float attConst;
			float attLin;
			float attQuad;
		};
		
		struct SpotLight
		{
			bool en;
			vec3 pos;
			vec3 dir;
			
			vec3 amb;
			vec3 diff;
			vec3 spec;
			
			float attConst;
			float attLin;
			float attQuad;
			
			float inner;
			float outer;
		};
		
		in vec3 vpos;
		in vec3 normal;
		in vec2 texuv;
		
		uniform float matBuf[16];
		uniform sampler2D matAmbTex;
		uniform sampler2D matDiffTex;
		uniform sampler2D matSpecTex;
		uniform DirectionalLight dirLight;
		uniform PointLight pointLights[POINTLIGHTS];
		uniform SpotLight spotLights[SPOTLIGHTS];
		uniform vec3 camPos;
		
		out vec4 fragColor;
		
		vec4 calcAmbient(vec3 vamb)
		{
			vec4 mamb = vec4(matBuf[0], matBuf[1], matBuf[2], matBuf[3]);
			vec4 ret = vec4(vamb, 1.f) * mamb;
			if(matBuf[4] != 0.f)
				ret *= texture(matAmbTex, texuv);
			
			return ret;
		}
		
		vec4 calcDiffuse(vec3 vdiff, vec3 lightDir)
		{
			vec4 mdiff = vec4(matBuf[5], matBuf[6], matBuf[7], matBuf[8]);
			float fdiff = max(dot(normal, lightDir), 0.f);
			vec4 ret = vec4(vdiff, 1.f) * mdiff * fdiff;
			if(matBuf[9] != 0.f)
				ret *= texture(matDiffTex, texuv);
			
			return ret;
		}
		
		vec4 calcSpecular(vec3 vspec, vec3 lightDir)
		{
			vec3 camDir = normalize(camPos - vpos);
			vec3 reflectDir = reflect(-lightDir, normal);
			vec4 mspec = vec4(matBuf[10], matBuf[11], matBuf[12], matBuf[13]);
			float fspec = pow(max(dot(camDir, reflectDir), 0.f), matBuf[15]);
			vec4 ret = vec4(vspec, 1.f) * mspec * fspec;
			if(matBuf[14] != 0.f)
				ret *= texture(matSpecTex, texuv);
			
			return ret;
		}
		
		float calcAttenuation(vec3 lightPos, float attConst, float attLin, float attQuad)
		{
			float distance = length(lightPos - vpos);
			return 1.f / (attConst + attLin * distance + attQuad * distance * distance);
		}
		
		vec4 calcDirectionalLight()
		{
			vec3 lightDir = normalize(-dirLight.dir);
			
			vec4 ambient = calcAmbient(dirLight.amb);
			vec4 diffuse = calcDiffuse(dirLight.diff, lightDir);
			vec4 specular = calcSpecular(dirLight.spec, lightDir);
			
			return ambient + diffuse + specular;
		}
		
		vec4 calcPointLight(int i)
		{
			PointLight pointLight = pointLights[i];
			vec3 lightDir = normalize(pointLight.pos - vpos);
			
			vec4 ambient = calcAmbient(pointLight.amb);
			vec4 diffuse = calcDiffuse(pointLight.diff, lightDir);
			vec4 specular = calcSpecular(pointLight.spec, lightDir);
			
			float attenuation = calcAttenuation(pointLight.pos, pointLight.attConst, pointLight.attLin, pointLight.attQuad);
			ambient *= attenuation;
			diffuse *= attenuation;
			specular *= attenuation;
			
			return ambient + diffuse + specular;
		}
		
		vec4 calcSpotLight(int i)
		{
			SpotLight spotLight = spotLights[i];
			vec3 lightDir = normalize(spotLight.pos - vpos);
			
			vec4 ambient = calcAmbient(spotLight.amb);
			vec4 diffuse = calcDiffuse(spotLight.diff, lightDir);
			vec4 specular = calcSpecular(spotLight.spec, lightDir);
			
			float attenuation = calcAttenuation(spotLight.pos, spotLight.attConst, spotLight.attLin, spotLight.attQuad);
			diffuse *= attenuation;
			specular *= attenuation;
			
			float theta = dot(lightDir, normalize(-spotLight.dir));
			float epsilon = spotLight.inner - spotLight.outer;
			float intensity = clamp((theta - spotLight.outer) / epsilon, 0.f, 1.f);
			
			diffuse *= intensity;
			specular *= intensity;
			
			return ambient + diffuse + specular;
		}
		
		void main()
		{
			fragColor = vec4(0.f);
			
			if(dirLight.en)
				fragColor += calcDirectionalLight();
			
			for(int i = 0; i < POINTLIGHTS; i++)
			{
				if(pointLights[i].en)
					fragColor += calcPointLight(i);
			}
			
			for(int i = 0; i < SPOTLIGHTS; i++)
			{
				if(spotLights[i].en)
					fragColor += calcSpotLight(i);
			}
		}`;
		
		super(gl, vertexShaderSource, fragmentShaderSource);
		
		this.getMaxPointLights = function()
		{
			return maxPointLights;
		};
		
		this.getMaxSpotLights = function()
		{
			return maxSpotLights;
		};
		
		var matBuf = new Float32Array(16);
		
		this.use();
		
		var camPosLoc = this.getUniform("camPos");
		var camMatLoc = this.getUniform("camMat");
		var norMatLoc = this.getUniform("norMat");
		var traMatLoc = this.getUniform("traMat");
		
		var matBufLoc = this.getUniform("matBuf");
		this.setUniformInt("matAmbTex", 0);
		this.setUniformInt("matDiffTex", 1);
		this.setUniformInt("matSpecTex", 2);
		
		var lightPointEnLoc       = [];
		var lightPointPosLoc      = [];
		var lightPointAmbLoc      = [];
		var lightPointDiffLoc     = [];
		var lightPointSpecLoc     = [];
		var lightPointAttConstLoc = [];
		var lightPointAttLinLoc   = [];
		var lightPointAttQuadLoc  = [];
		
		var lightSpotEnLoc       = [];
		var lightSpotPosLoc      = [];
		var lightSpotDirLoc      = [];
		var lightSpotAmbLoc      = [];
		var lightSpotDiffLoc     = [];
		var lightSpotSpecLoc     = [];
		var lightSpotAttConstLoc = [];
		var lightSpotAttLinLoc   = [];
		var lightSpotAttQuadLoc  = [];
		var lightSpotInnerLoc    = [];
		var lightSpotOuterLoc    = [];
		
		this.setUniformDirectionalLightEnable = function(en)
		{
			this.setUniformBool(lightDirEnLoc, en);
		};
		
		var lightDirEnLoc =   this.getUniform("dirLight.en");
		var lightDirDirLoc =  this.getUniform("dirLight.dir");
		var lightDirAmbLoc =  this.getUniform("dirLight.amb");
		var lightDirDiffLoc = this.getUniform("dirLight.diff");
		var lightDirSpecLoc = this.getUniform("dirLight.spec");
		this.setUniformDirectionalLightEnable(false);
		
		//Toggle point light #i
		this.setUniformPointLightEnable = function(i, en)
		{
			this.setUniformBool(lightPointEnLoc[i], en);
		};
		
		for(var i = 0; i < maxPointLights; i++)
		{
			lightPointEnLoc[i]       = this.getUniform("pointLights[" + i + "].en");
			lightPointPosLoc[i]      = this.getUniform("pointLights[" + i + "].pos");
			lightPointAmbLoc[i]      = this.getUniform("pointLights[" + i + "].amb");
			lightPointDiffLoc[i]     = this.getUniform("pointLights[" + i + "].diff");
			lightPointSpecLoc[i]     = this.getUniform("pointLights[" + i + "].spec");
			lightPointAttConstLoc[i] = this.getUniform("pointLights[" + i + "].attConst");
			lightPointAttLinLoc[i]   = this.getUniform("pointLights[" + i + "].attLin");
			lightPointAttQuadLoc[i]  = this.getUniform("pointLights[" + i + "].attQuad");
			this.setUniformPointLightEnable(i, false);
		}
		
		//Togle spotlight #i
		this.setUniformSpotLightEnable = function(i, en)
		{
			this.setUniformBool(lightSpotEnLoc[i], en);
		};
		
		for(var i = 0; i < maxSpotLights; i++)
		{
			lightSpotEnLoc[i]       = this.getUniform("spotLights[" + i + "].en");
			lightSpotPosLoc[i]      = this.getUniform("spotLights[" + i + "].pos");
			lightSpotDirLoc[i]      = this.getUniform("spotLights[" + i + "].dir");
			lightSpotAmbLoc[i]      = this.getUniform("spotLights[" + i + "].amb");
			lightSpotDiffLoc[i]     = this.getUniform("spotLights[" + i + "].diff");
			lightSpotSpecLoc[i]     = this.getUniform("spotLights[" + i + "].spec");
			lightSpotAttConstLoc[i] = this.getUniform("spotLights[" + i + "].attConst");
			lightSpotAttLinLoc[i]   = this.getUniform("spotLights[" + i + "].attLin");
			lightSpotAttQuadLoc[i]  = this.getUniform("spotLights[" + i + "].attQuad");
			lightSpotInnerLoc[i]    = this.getUniform("spotLights[" + i + "].inner");
			lightSpotOuterLoc[i]    = this.getUniform("spotLights[" + i + "].outer");
			this.setUniformSpotLightEnable(i, false);
		}
		
		//Render a MatMesh with the current value of traMat and norMat, or (more commonly) a Model
		//Primitive defaults to gl.TRIANGLES
		this.render = function(model, primitive)
		{
			if(model instanceof MatMesh)
			{
				var mat = model.material;
				this.setUniformMaterial(mat);
				
				if(mat.ambientTextureEnable)
					mat.ambientTexture.bind(0);
				if(mat.diffuseTextureEnable)
					mat.diffuseTexture.bind(1);
				if(mat.specularTextureEnable)
					mat.specularTexture.bind(2);
				
				model.mesh.bind();
				gl.drawElements(primitive || gl.TRIANGLES, model.mesh.getIndexLength(), gl.UNSIGNED_INT, 0);
			}
			else if(model instanceof Model)
			{
				this.setUniformMatrix4(traMatLoc, model.transform);
				this.setUniformMatrix4(norMatLoc, model.transform.calculateNormal(__gljs_tmpMat2));
				
				for(var mm of model.data)
					this.render(mm, primitive);
			}
		};
		
		this.setUniformCamera = function(camera)
		{
			this.setUniformVector3(camPosLoc, camera.position);
			this.setUniformMatrix4(camMatLoc, camera.calculateMatrix(__gljs_tmpMat2));
		};
		
		this.setUniformMaterial = function(material)
		{
			var ambCol = material.ambientColor;
			var diffCol = material.diffuseColor;
			var specCol = material.specularColor;
			
			matBuf[0 ] = ambCol.r;
			matBuf[1 ] = ambCol.g;
			matBuf[2 ] = ambCol.b;
			matBuf[3 ] = ambCol.a;
			matBuf[4 ] = material.ambientTextureEnable;
			matBuf[5 ] = diffCol.r;
			matBuf[6 ] = diffCol.g;
			matBuf[7 ] = diffCol.b;
			matBuf[8 ] = diffCol.a;
			matBuf[9 ] = material.diffuseTextureEnable;
			matBuf[10] = specCol.r;
			matBuf[11] = specCol.g;
			matBuf[12] = specCol.b;
			matBuf[13] = specCol.a;
			matBuf[14] = material.specularTextureEnable;
			matBuf[15] = material.specularShine;
			
			this.setUniformFloatArray(matBufLoc, matBuf); //much faster than 7 individual setUniform calls in a row
		};
		
		this.setUniformDirectionalLight = function(light)
		{
			this.setUniformVector3(lightDirDirLoc,  light.direction);
			this.setUniformVector3(lightDirAmbLoc,  light.ambient);
			this.setUniformVector3(lightDirDiffLoc, light.diffuse);
			this.setUniformVector3(lightDirSpecLoc, light.specular);
		};
		
		//Set point light #i
		this.setUniformPointLight = function(i, light)
		{
			this.setUniformVector3(lightPointPosLoc[i],      light.position);
			this.setUniformVector3(lightPointAmbLoc[i],      light.ambient);
			this.setUniformVector3(lightPointDiffLoc[i],     light.diffuse);
			this.setUniformVector3(lightPointSpecLoc[i],     light.specular);
			this.setUniformFloat  (lightPointAttConstLoc[i], light.attenuationConstant);
			this.setUniformFloat  (lightPointAttLinLoc[i],   light.attenuationLinear);
			this.setUniformFloat  (lightPointAttQuadLoc[i],  light.attenuationQuadratic);
		};
		
		//Set spotlight #i
		this.setUniformSpotLight = function(i, light)
		{
			this.setUniformVector3(lightSpotPosLoc[i],      light.position);
			this.setUniformVector3(lightSpotDirLoc[i],      light.direction);
			this.setUniformVector3(lightSpotAmbLoc[i],      light.ambient);
			this.setUniformVector3(lightSpotDiffLoc[i],     light.diffuse);
			this.setUniformVector3(lightSpotSpecLoc[i],     light.specular);
			this.setUniformFloat  (lightSpotAttConstLoc[i], light.attenuationConstant);
			this.setUniformFloat  (lightSpotAttLinLoc[i],   light.attenuationLinear);
			this.setUniformFloat  (lightSpotAttQuadLoc[i],  light.attenuationQuadratic);
			this.setUniformFloat  (lightSpotInnerLoc[i],    light.innerCutOff);
			this.setUniformFloat  (lightSpotOuterLoc[i],    light.outerCutOff);
		};
	}
}

//Shader with flat shading. Only uses ambient attributes of materials. Must be disposed with .dispose()
class SimpleShader extends Shader
{
	constructor(gl)
	{
		var vertexShaderSource =
		`#version 300 es
		precision highp float;
		
		layout(location = 0) in vec3 aPos;
		layout(location = 2) in vec2 aTexuv;
		
		uniform mat4 camMat, traMat;
		
		out vec2 texuv;
		
		void main()
		{
			texuv = aTexuv;
			gl_Position = camMat * traMat * vec4(aPos, 1.0);
		}`;
		
		var fragmentShaderSource =
		`#version 300 es
		precision highp float;
		
		in vec2 texuv;
		
		uniform vec4 matCol;
		uniform sampler2D matTex;
		uniform bool matTexEn;
		
		out vec4 fragColor;
		
		void main()
		{
			fragColor = matCol;
			if(matTexEn)
				fragColor *= texture(matTex, texuv);
		}`;
		
		super(gl, vertexShaderSource, fragmentShaderSource);
		
		this.use();
		
		var camMatLoc = this.getUniform("camMat");
		var traMatLoc = this.getUniform("traMat");
		
		var matColLoc   = this.getUniform("matCol");
		var matTexEnLoc = this.getUniform("matTexEn");
		this.setUniformInt("matTex", 0);
		
		//Render a MatMesh with the current value of traMat, or (more commonly) a Model
		//Primitive defaults to gl.TRIANGLES
		this.render = function(model, primitive)
		{
			if(model instanceof MatMesh)
			{
				this.setUniformMaterial(model.material);
				
				if(model.material.ambientTextureEnable)
					model.material.ambientTexture.bind(0);
				
				model.mesh.bind();
				gl.drawElements(primitive || gl.TRIANGLES, model.mesh.getIndexLength(), gl.UNSIGNED_INT, 0);
			}
			else if(model instanceof Model)
			{
				this.setUniformMatrix4(traMatLoc, model.transform);
				
				for(var mm of model.data)
					this.render(mm, primitive);
			}
		};
		
		this.setUniformCamera = function(camera)
		{
			this.setUniformMatrix4(camMatLoc, camera.calculateMatrix(__gljs_tmpMat2));
		};
		
		this.setUniformMaterial = function(material)
		{
			this.setUniformColor(matColLoc, material.ambientColor);
			this.setUniformBool(matTexEnLoc, material.ambientTextureEnable);
		};
	}
}

//Shader optimized for 2D texture rendering. Must be disposed with .dispose()
class TextureShader extends Shader
{
	constructor(gl)
	{
		var vertexShaderSource =
		`#version 300 es
		precision highp float;
		
		layout(location = 0) in vec3 aPos;
		
		uniform mat4 camMat, traMat;
		
		out vec2 texuv;
		
		void main()
		{
			texuv = vec2(aPos.x, 1.f - aPos.y);
			gl_Position = camMat * traMat * vec4(aPos, 1.0);
		}`;
		
		var fragmentShaderSource =
		`#version 300 es
		precision highp float;
		
		in vec2 texuv;
		
		uniform sampler2D tex;
		uniform float alpha;
		
		out vec4 fragColor;
		
		void main()
		{
			fragColor = texture(tex, texuv) * vec4(1.f, 1.f, 1.f, alpha);
		}`;
		
		super(gl, vertexShaderSource, fragmentShaderSource);
		
		this.use();
		
		var camMatLoc = this.getUniform("camMat");
		var traMatLoc = this.getUniform("traMat");
		var alphaLoc = this.getUniform("alpha");
		this.setUniformInt("tex", 2);
		
		var vbuf = [];
		var ibuf = new Uint32Array(6);
		
		vbuf[0] = new Vertex(V0);
		vbuf[1] = new Vertex(VX);
		vbuf[2] = new Vertex(VY);
		vbuf[3] = new Vertex(__gljs_tmpVec.set(1, 1, 0));
		
		ibuf[0] = 0;
		ibuf[1] = 1;
		ibuf[2] = 2;
		ibuf[3] = 3;
		ibuf[4] = 2;
		ibuf[5] = 1;
		
		var mesh = new Mesh(gl, vbuf, ibuf);
		
		//Render a Texture:
		// - render(Texture, x, y, width, height, alpha, depth): at (x, y, depth) with optional width and height (defaults to texture's width and height) (A)
		// - render(Texture, Matrix4, alpha): provide your own transform (B)
		this.render = function(tex, x = 0, y = 0, w, h, alpha = 1, depth = 0)
		{
			if(!w) w = tex.getWidth();
			if(!h) h = tex.getHeight();
			
			if(x instanceof Matrix4) //A
			{
				this.setUniformMatrix4(traMatLoc, x);
				
				if(!y)
					alpha = 1;
				else
					alpha = y;
			}
			else //B
			{
				__gljs_tmpMat2.setTranslation(__gljs_tmpVec.set(x, y, depth)).mul(__gljs_tmpVec.set(w, h, 1));
				this.setUniformMatrix4(traMatLoc, __gljs_tmpMat2);
			}
			
			this.setUniformFloat(alphaLoc, alpha);
			
			tex.bind(2);
			gl.drawElements(gl.TRIANGLES, mesh.getIndexLength(), gl.UNSIGNED_INT, 0);
		};
		
		this.setUniformCamera = function(camera)
		{
			this.setUniformMatrix4(camMatLoc, camera.calculateMatrix(__gljs_tmpMat2));
		};
		
		var overrideUse = this.use.bind(this);
		this.use = function()
		{
			overrideUse();
			mesh.bind();
		}
		
		var overrideDispose = this.dispose.bind(this);
		this.dispose = function()
		{
			mesh.dispose();
			overrideDispose();
		};
	}
}

//Call after every frame
function updateDeltaTime()
{
	var curTime = performance.now() / 1000;
	deltaTime = curTime - __gljs_prvTime;
	__gljs_prvTime = curTime;
}

//Used to smoothly animate at a constant speed, regardless of FPS/delta time
function getDeltaSpeed(originalSpeed, target = targetFPS)
{
	return originalSpeed * deltaTime * target;
}

const COLOR_CLEAR   = new Color(0, 0, 0, 0);
const COLOR_BLACK   = new Color(0, 0, 0, 1);
const COLOR_RED     = new Color(1, 0, 0, 1);
const COLOR_GREEN   = new Color(0, 1, 0, 1);
const COLOR_BLUE    = new Color(0, 0, 1, 1);
const COLOR_YELLOW  = new Color(1, 1, 0, 1);
const COLOR_CYAN    = new Color(0, 1, 1, 1);
const COLOR_MAGENTA = new Color(1, 0, 1, 1);
const COLOR_WHITE   = new Color(1, 1, 1, 1);

var deltaTime = 0; //Time in seconds between frames
var targetFPS = 60; //Framerate goal

//Do not use
const __gljs_tmpMat1 = new Matrix4();
const __gljs_tmpMat2 = new Matrix4();
const __gljs_tmpVec = new Vector3();
var __gljs_prvTime = 0;
