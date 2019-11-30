//Column-major 4x4 matrix. Values are stored in "val" property
class Matrix4
{
	//Initialize this matrix using set(), or identity matrix if no args were passed
	constructor(b)
	{
		this.val = new Float32Array(16);
		
		if(b)
			this.set(b);
		else
			this.idt();
	}
	
	//Set this matrix to b. Can be another Matrix4, Quaternion, or SimpleTransform
	set(b)
	{
		var val = this.val;
		
		if(b instanceof Matrix4)
		{
			for(var i = 0; i < 16; i++)
				val[i] = b.val[i];
		}
		else if(b instanceof Quaternion)
		{
			var xs = b.x * 2,  ys = b.y * 2,  zs = b.z * 2;
			var wx = b.w * xs, wy = b.w * ys, wz = b.w * zs;
			var xx = b.x * xs, xy = b.x * ys, xz = b.x * zs;
			var yy = b.y * ys, yz = b.y * zs, zz = b.z * zs;
			
			val[M00] = 1 - yy - zz; val[M01] = xy - wz;     val[M02] = xz + wy;     val[M03] = 0;
			val[M10] = xy + wz;     val[M11] = 1 - xx - zz; val[M12] = yz - wx;     val[M13] = 0;
			val[M20] = xz - wy;     val[M21] = yz + wx;     val[M22] = 1 - xx - yy; val[M23] = 0;
			val[M30] = 0;           val[M31] = 0;           val[M32] = 0;           val[M33] = 1;
		}
		else if(b instanceof SimpleTransform)
		{
			this.setTranslation(b.translation).mul(b.rotation).mul(b.scale);
		}
		
		return this;
	}
	
	//Multiply this matrix with b. If b is:
	// - Matrix4: do matrix multiplication (A)
	// - Quaternion or SimpleTransform: convert b to matrix and then multiply (B)
	// - Vector3: convert b to a scaling matrix (setScale) and then multiply (C)
	mul(b)
	{
		if(b instanceof Matrix4) //A
		{
			var val = this.val;
			b = b.val;
			
			__mjs_tmpMat1.val[M00] = val[M00] * b[M00] + val[M01] * b[M10] + val[M02] * b[M20] + val[M03] * b[M30];
			__mjs_tmpMat1.val[M01] = val[M00] * b[M01] + val[M01] * b[M11] + val[M02] * b[M21] + val[M03] * b[M31];
			__mjs_tmpMat1.val[M02] = val[M00] * b[M02] + val[M01] * b[M12] + val[M02] * b[M22] + val[M03] * b[M32];
			__mjs_tmpMat1.val[M03] = val[M00] * b[M03] + val[M01] * b[M13] + val[M02] * b[M23] + val[M03] * b[M33];
			__mjs_tmpMat1.val[M10] = val[M10] * b[M00] + val[M11] * b[M10] + val[M12] * b[M20] + val[M13] * b[M30];
			__mjs_tmpMat1.val[M11] = val[M10] * b[M01] + val[M11] * b[M11] + val[M12] * b[M21] + val[M13] * b[M31];
			__mjs_tmpMat1.val[M12] = val[M10] * b[M02] + val[M11] * b[M12] + val[M12] * b[M22] + val[M13] * b[M32];
			__mjs_tmpMat1.val[M13] = val[M10] * b[M03] + val[M11] * b[M13] + val[M12] * b[M23] + val[M13] * b[M33];
			__mjs_tmpMat1.val[M20] = val[M20] * b[M00] + val[M21] * b[M10] + val[M22] * b[M20] + val[M23] * b[M30];
			__mjs_tmpMat1.val[M21] = val[M20] * b[M01] + val[M21] * b[M11] + val[M22] * b[M21] + val[M23] * b[M31];
			__mjs_tmpMat1.val[M22] = val[M20] * b[M02] + val[M21] * b[M12] + val[M22] * b[M22] + val[M23] * b[M32];
			__mjs_tmpMat1.val[M23] = val[M20] * b[M03] + val[M21] * b[M13] + val[M22] * b[M23] + val[M23] * b[M33];
			__mjs_tmpMat1.val[M30] = val[M30] * b[M00] + val[M31] * b[M10] + val[M32] * b[M20] + val[M33] * b[M30];
			__mjs_tmpMat1.val[M31] = val[M30] * b[M01] + val[M31] * b[M11] + val[M32] * b[M21] + val[M33] * b[M31];
			__mjs_tmpMat1.val[M32] = val[M30] * b[M02] + val[M31] * b[M12] + val[M32] * b[M22] + val[M33] * b[M32];
			__mjs_tmpMat1.val[M33] = val[M30] * b[M03] + val[M31] * b[M13] + val[M32] * b[M23] + val[M33] * b[M33];
			
			this.set(__mjs_tmpMat1);
		}
		else if(b instanceof Quaternion || b instanceof SimpleTransform) //B
		{
			this.mul(__mjs_tmpMat2.set(b));
		}
		else if(b instanceof Vector3) //C
		{
			this.mul(__mjs_tmpMat2.setScale(b));
		}
		
		return this;
	}
	
	//Convert vec to a translation matrix (setTranslation) and then multiply
	add(vec)
	{
		return this.mul(__mjs_tmpMat2.setTranslation(vec));
	}
	
	//Negate vec, convert it to a translation matrix (setTranslation), and then multiply
	sub(vec)
	{
		return this.mul(__mjs_tmpMat2.setTranslation(__mjs_tmpVec1.set(vec).scl(-1)));
	}
	
	//Set this matrix to a translation matrix
	setTranslation(vec)
	{
		var val = this.val;
		val[M00] = 1; val[M01] = 0; val[M02] = 0;  val[M03] = vec.x;
		val[M10] = 0; val[M11] = 1; val[M12] = 0;  val[M13] = vec.y;
		val[M20] = 0; val[M21] = 0; val[M22] = 1;  val[M23] = vec.z;
		val[M30] = 0; val[M31] = 0; val[M32] = 0;  val[M33] = 1;
		return this;
	}
	
	//Set this matrix to a scaling matrix
	setScale(vec)
	{
		var val = this.val;
		val[M00] = vec.x; val[M01] = 0;     val[M02] = 0;     val[M03] = 0;
		val[M10] = 0;     val[M11] = vec.y; val[M12] = 0;     val[M13] = 0;
		val[M20] = 0;     val[M21] = 0;     val[M22] = vec.z; val[M23] = 0;
		val[M30] = 0;     val[M31] = 0;     val[M32] = 0;     val[M33] = 1;
		return this;
	}
	
	//Set this matrix to an orthographic camera matrix (for Camera class; normally 2D projection)
	setOrthographic(left = -1, right = 1, bottom = -1, top = 1, near = 0, far = 1)
	{
		var val = this.val;
		var rml = right - left;
		var tmb = top - bottom;
		var fmn = far - near;
		
		val[M00] = 2 / rml; val[M01] = 0;       val[M02] =  0;       val[M03] = -(right + left) / rml;
		val[M10] = 0;       val[M11] = 2 / tmb; val[M12] =  0;       val[M13] = -(top + bottom) / tmb;
		val[M20] = 0;       val[M21] = 0;       val[M22] = -2 / fmn; val[M23] = -(far + near)   / fmn;
		val[M30] = 0;       val[M31] = 0;       val[M32] =  0;       val[M33] = 1;
		return this;
	}
	
	//Set this matrix to a perspective camera matrix (for Camera class; normally 3D projection)
	setPerspective(near, far, fovy, aspectRatio)
	{
		var val = this.val;
		var fd = (1 / Math.tan(fovy / 2));
		var a1 = (far + near) / (near - far);
		var a2 = (2 * far * near) / (near - far);
		
		val[M00] = fd / aspectRatio; val[M01] = 0;  val[M02] =  0;  val[M03] = 0;
		val[M10] = 0;                val[M11] = fd; val[M12] =  0;  val[M13] = 0;
		val[M20] = 0;                val[M21] = 0;  val[M22] =  a1; val[M23] = a2;
		val[M30] = 0;                val[M31] = 0;  val[M32] = -1;  val[M33] = 0;
		return this;
	}
	
	//Set this matrix to a view matrix (for Camera class; used internally)
	setView(position, direction, up)
	{
		var val = this.val;
		
		var z = __mjs_tmpVec2.set(direction).nor(); //forward
		var x = __mjs_tmpVec3.set(z).crs(up).nor(); //right
		val[M00] =  x.x; val[M01] =  x.y; val[M02] =  x.z; val[M03] = 0;
		
		var y = __mjs_tmpVec3.crs(z).nor(); //orthonormal up
		val[M10] =  y.x; val[M11] =  y.y; val[M12] =  y.z; val[M13] = 0;
		val[M20] = -z.x; val[M21] = -z.y; val[M22] = -z.z; val[M23] = 0;
		val[M30] =  0;   val[M31] =  0;   val[M32] =  0;   val[M33] = 1;
		return this.sub(position);
	}
	
	//Convert this model transform matrix to a normal matrix (for DefaultShader class; used internally for shading calculations)
	calculateNormal(out)
	{
		out.set(this);
		out.val[M03] = 0;
		out.val[M13] = 0;
		out.val[M23] = 0;
		out.inv();
		return out.tra();
	}
	
	//Set this matrix to the identity matrix
	idt()
	{
		var val = this.val;
		val[M00] = 1; val[M01] = 0; val[M02] = 0; val[M03] = 0;
		val[M10] = 0; val[M11] = 1; val[M12] = 0; val[M13] = 0;
		val[M20] = 0; val[M21] = 0; val[M22] = 1; val[M23] = 0;
		val[M30] = 0; val[M31] = 0; val[M32] = 0; val[M33] = 1;
		return this;
	}
	
	//Invert this matrix. Return false on failure (det() === 0) or true on success
	inv()
	{
		var rdet = this.det();
		if(rdet === 0)
			return false;
		
		rdet = 1 / rdet;
		var tmp = __mjs_tmpMat1.val;
		var val = this.val;
		
		tmp[M00] = val[M12] * val[M23] * val[M31] - val[M13] * val[M22] * val[M31] + val[M13] * val[M21] * val[M32] -
				val[M11] * val[M23] * val[M32] - val[M12] * val[M21] * val[M33] + val[M11] * val[M22] * val[M33];
		tmp[M01] = val[M03] * val[M22] * val[M31] - val[M02] * val[M23] * val[M31] - val[M03] * val[M21] * val[M32] +
				val[M01] * val[M23] * val[M32] + val[M02] * val[M21] * val[M33] - val[M01] * val[M22] * val[M33];
		tmp[M02] = val[M02] * val[M13] * val[M31] - val[M03] * val[M12] * val[M31] + val[M03] * val[M11] * val[M32] -
				val[M01] * val[M13] * val[M32] - val[M02] * val[M11] * val[M33] + val[M01] * val[M12] * val[M33];
		tmp[M03] = val[M03] * val[M12] * val[M21] - val[M02] * val[M13] * val[M21] - val[M03] * val[M11] * val[M22] +
				val[M01] * val[M13] * val[M22] + val[M02] * val[M11] * val[M23] - val[M01] * val[M12] * val[M23];
		tmp[M10] = val[M13] * val[M22] * val[M30] - val[M12] * val[M23] * val[M30] - val[M13] * val[M20] * val[M32] +
				val[M10] * val[M23] * val[M32] + val[M12] * val[M20] * val[M33] - val[M10] * val[M22] * val[M33];
		tmp[M11] = val[M02] * val[M23] * val[M30] - val[M03] * val[M22] * val[M30] + val[M03] * val[M20] * val[M32] -
				val[M00] * val[M23] * val[M32] - val[M02] * val[M20] * val[M33] + val[M00] * val[M22] * val[M33];
		tmp[M12] = val[M03] * val[M12] * val[M30] - val[M02] * val[M13] * val[M30] - val[M03] * val[M10] * val[M32] +
				val[M00] * val[M13] * val[M32] + val[M02] * val[M10] * val[M33] - val[M00] * val[M12] * val[M33];
		tmp[M13] = val[M02] * val[M13] * val[M20] - val[M03] * val[M12] * val[M20] + val[M03] * val[M10] * val[M22] -
				val[M00] * val[M13] * val[M22] - val[M02] * val[M10] * val[M23] + val[M00] * val[M12] * val[M23];
		tmp[M20] = val[M11] * val[M23] * val[M30] - val[M13] * val[M21] * val[M30] + val[M13] * val[M20] * val[M31] -
				val[M10] * val[M23] * val[M31] - val[M11] * val[M20] * val[M33] + val[M10] * val[M21] * val[M33];
		tmp[M21] = val[M03] * val[M21] * val[M30] - val[M01] * val[M23] * val[M30] - val[M03] * val[M20] * val[M31] +
				val[M00] * val[M23] * val[M31] + val[M01] * val[M20] * val[M33] - val[M00] * val[M21] * val[M33];
		tmp[M22] = val[M01] * val[M13] * val[M30] - val[M03] * val[M11] * val[M30] + val[M03] * val[M10] * val[M31] -
				val[M00] * val[M13] * val[M31] - val[M01] * val[M10] * val[M33] + val[M00] * val[M11] * val[M33];
		tmp[M23] = val[M03] * val[M11] * val[M20] - val[M01] * val[M13] * val[M20] - val[M03] * val[M10] * val[M21] +
				val[M00] * val[M13] * val[M21] + val[M01] * val[M10] * val[M23] - val[M00] * val[M11] * val[M23];
		tmp[M30] = val[M12] * val[M21] * val[M30] - val[M11] * val[M22] * val[M30] - val[M12] * val[M20] * val[M31] +
				val[M10] * val[M22] * val[M31] + val[M11] * val[M20] * val[M32] - val[M10] * val[M21] * val[M32];
		tmp[M31] = val[M01] * val[M22] * val[M30] - val[M02] * val[M21] * val[M30] + val[M02] * val[M20] * val[M31] -
				val[M00] * val[M22] * val[M31] - val[M01] * val[M20] * val[M32] + val[M00] * val[M21] * val[M32];
		tmp[M32] = val[M02] * val[M11] * val[M30] - val[M01] * val[M12] * val[M30] - val[M02] * val[M10] * val[M31] +
				val[M00] * val[M12] * val[M31] + val[M01] * val[M10] * val[M32] - val[M00] * val[M11] * val[M32];
		tmp[M33] = val[M01] * val[M12] * val[M20] - val[M02] * val[M11] * val[M20] + val[M02] * val[M10] * val[M21] -
				val[M00] * val[M12] * val[M21] - val[M01] * val[M10] * val[M22] + val[M00] * val[M11] * val[M22];
		
		for(var i = 0; i < 16; i++)
			val[i] = tmp[i] * rdet;
		
		return true;
	}
	
	//Set this matrix to its transpose
	tra()
	{
		var tmp = __mjs_tmpMat1.val;
		var val = this.val;
		
		tmp[M00] = val[M00]; tmp[M01] = val[M10]; tmp[M02] = val[M20]; tmp[M03] = val[M30];
		tmp[M10] = val[M01]; tmp[M11] = val[M11]; tmp[M12] = val[M21]; tmp[M13] = val[M31];
		tmp[M20] = val[M02]; tmp[M21] = val[M12]; tmp[M22] = val[M22]; tmp[M23] = val[M32];
		tmp[M30] = val[M03]; tmp[M31] = val[M13]; tmp[M32] = val[M23]; tmp[M33] = val[M33];
		return this.set(__mjs_tmpMat1);
	}
	
	//Rotate this matrix rad radians around axis. Equivalent to multiplying by a quaternion
	rotate(axis, rad)
	{
		return this.mul(__mjs_tmpQuat.setRotation(axis, rad));
	}
	
	//Return the determinant of this matrix
	det()
	{
		var val = this.val;
		return val[M30] * val[M21] * val[M12] * val[M03] - val[M20] * val[M31] * val[M12] * val[M03] -
				val[M30] * val[M11] * val[M22] * val[M03] + val[M10] * val[M31] * val[M22] * val[M03] +
				val[M20] * val[M11] * val[M32] * val[M03] - val[M10] * val[M21] * val[M32] * val[M03] -
				val[M30] * val[M21] * val[M02] * val[M13] + val[M20] * val[M31] * val[M02] * val[M13] +
				val[M30] * val[M01] * val[M22] * val[M13] - val[M00] * val[M31] * val[M22] * val[M13] -
				val[M20] * val[M01] * val[M32] * val[M13] + val[M00] * val[M21] * val[M32] * val[M13] +
				val[M30] * val[M11] * val[M02] * val[M23] - val[M10] * val[M31] * val[M02] * val[M23] -
				val[M30] * val[M01] * val[M12] * val[M23] + val[M00] * val[M31] * val[M12] * val[M23] +
				val[M10] * val[M01] * val[M32] * val[M23] - val[M00] * val[M11] * val[M32] * val[M23] -
				val[M20] * val[M11] * val[M02] * val[M33] + val[M10] * val[M21] * val[M02] * val[M33] +
				val[M20] * val[M01] * val[M12] * val[M33] - val[M00] * val[M21] * val[M12] * val[M33] -
				val[M10] * val[M01] * val[M22] * val[M33] + val[M00] * val[M11] * val[M22] * val[M33];
	}
}

//A mathemagical black box used to do 3D rotations
class Quaternion
{
	//Initialize this quaternion using set()
	constructor(x, y, z, w)
	{
		this.set(x, y, z, w);
	}
	
	//Set this quaternion to (x, y, z, w), another Quaternion object, or identity quaternion if no args were passed
	set(x = 0, y = 0, z = 0, w = 1)
	{
		if(typeof x === "number")
		{
			this.x = x;
			this.y = y;
			this.z = z;
			this.w = w;
		}
		else
		{
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
			this.w = x.w;
		}
		
		return this;
	}
	
	//Set this quaternion to an axis-angle rotation (rad radians around axis)
	setRotation(axis, rad)
	{
		var d = axis.len2();
		if(d === 0) return this.set();
		d = Math.sqrt(d);
		
		var ang = rad < 0 ? PI2 - (-rad % PI2) : rad % PI2;
		var fsin = Math.sin(ang / 2);
		var fcos = Math.cos(ang / 2);
		var dsin = fsin / d;
		
		return this.set(axis.x * dsin, axis.y * dsin, axis.z * dsin, fcos).nor();
	}
	
	//Normalize this quaternion (set its length to 1)
	nor()
	{
		var len = this.len2();
		if(len !== 0 && len !== 1)
		{
			len = Math.sqrt(len);
			this.x /= len;
			this.y /= len;
			this.z /= len;
			this.w /= len;
		}
		
		return this;
	}
	
	//Return the squared length of this quaternion
	len2()
	{
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
	
	//Return the length of this quaternion
	len()
	{
		return Math.sqrt(this.len2());
	}
}

//3D Vector
class Vector3
{
	//Initialize this vector using set()
	constructor(x, y, z)
	{
		this.set(x, y, z);
	}
	
	//Set this vector to (x, y, z), another Vector3 object, or (0, 0, 0) if no args were passed
	set(x = 0, y = 0, z = 0)
	{
		if(typeof x === "number")
		{
			this.x = x;
			this.y = y;
			this.z = z;
		}
		else
		{
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
		}
		
		return this;
	}
	
	//Multiply this vector by a Matrix4
	mul(mat)
	{
		var val = mat.val;
		var x = this.x;
		var y = this.y;
		var z = this.z;
		
		return this.set(x * val[M00] + y * val[M01] + z * val[M02] + val[M03],
				x * val[M10] + y * val[M11] + z * val[M12] + val[M13],
				x * val[M20] + y * val[M21] + z * val[M22] + val[M23]);
	}
	
	//Multiply this vector by a Matrix4, then divide by w. Normally used to convert 3D coordinates to 2D NDC using output of Camera.calculateMatrix()
	prj(mat)
	{
		var val = mat.val;
		var w = this.x * val[M30] + this.y * val[M31] + this.z * val[M32] + val[M33];
		return this.mul(mat).scl(1 / w);
	}
	
	//Add another vector to this vector
	add(vec)
	{
		this.x += vec.x;
		this.y += vec.y;
		this.z += vec.z;
		return this;
	}
	
	//Subtract another vector from this vector
	sub(vec)
	{
		this.x -= vec.x;
		this.y -= vec.y;
		this.z -= vec.z;
		return this;
	}
	
	//Scale this vector by scalar
	scl(scalar)
	{
		this.x *= scalar;
		this.y *= scalar;
		this.z *= scalar;
		return this;
	}
	
	//Normalize this vector (set its length to 1)
	nor()
	{
		var len = this.len2();
		if(len !== 0 && len !== 1)
		{
			len = Math.sqrt(len);
			this.scl(1 / len);
		}
		
		return this;
	}
	
	//Set this vector to the cross product of this vector and another vector
	crs(vec)
	{
		__mjs_tmpVec1.x = this.y * vec.z - this.z * vec.y;
		__mjs_tmpVec1.y = this.z * vec.x - this.x * vec.z;
		__mjs_tmpVec1.z = this.x * vec.y - this.y * vec.x;
		return this.set(__mjs_tmpVec1);
	}
	
	//Rotate this vector rad radians around axis. Equivalent to multiplying by a quaternion
	rotate(axis, rad)
	{
		return this.mul(__mjs_tmpMat1.set(__mjs_tmpQuat.setRotation(axis, rad)));
	}
	
	//Return the squared length of this vector (distance from origin)
	len2()
	{
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	
	//Return the length of this vector (distance from origin)
	len()
	{
		return Math.sqrt(this.len2());
	}
	
	//Return the distance from this vector to another vector
	dst(vec)
	{
		return __mjs_tmpVec1.set(this).sub(vec).len();
	}
	
	//Return the dot product of this vector and another vector
	dot(vec)
	{
		return this.x * vec.x + this.y * vec.y + this.z * vec.z;
	}
	
	//Return the angle between this vector and another vector in radians
	ang(vec)
	{
		return Math.acos(this.dot(vec) / (this.len() * vec.len()));
	}
	
	//Return whether this vector and another vector are equal
	equals(vec)
	{
		return this.x === vec.x && this.y === vec.y && this.z === vec.z;
	}
}

//Represents an affine transformation (excluding shearing). Useful for Model.transform.set(SimpleTransform)
class SimpleTransform
{
	//Initialize this transform to st, or no translation/rotation/scaling if no args were passed
	constructor(st)
	{
		this.translation = new Vector3();
		this.rotation = new Quaternion();
		this.scale = new Vector3(V1);
		
		if(st)
			this.set(st);
	}
	
	//Set this transform to another transform
	set(st)
	{
		this.translation.set(st.translation);
		this.rotation.set(st.rotation);
		this.scale.set(st.scale);
	}
}

//3D plane represented by a normal vector and 
class Plane
{
	//Initialize this plane using set(), or leave unset if no args were passed
	constructor(a0, a1, a2)
	{
		this.normal = new Vector3();
		this.d = 0;
		
		if(a0)
			this.set(a0, a1, a2);
	}
	
	//Set this plane to:
	// - set(Plane): another plane (A)
	// - set(Vector3, Vector3): normal vector and point on the plane, respectively (B)
	// - set(Vector3, Number): normal vector and distance from origin (C)
	// - set(Vector3, Vector3, Vector3): contain all 3 points (D)
	set(a0, a1, a2)
	{
		if(a0 instanceof Plane) //A
		{
			this.normal.set(a0.normal);
			this.d = a0.d;
		}
		else if(!a2)
		{
			this.normal.set(a0).nor();
			if(a1 instanceof Vector3) //B
				this.d = -this.normal.dot(a1);
			else //C
				this.d = a1;
		}
		else //D
		{
			var n = this.normal;
			n.set(a0).sub(a1).crs(__mjs_tmpVec2.set(a1).sub(a2)).nor();
			this.d = -a0.dot(n);
		}
		
		return this;
	}
	
	//Return the minimum distance between this plane and a vector. Sign will determine which side of the plane that vec is on (+: front, -: back, 0: on plane)
	dst(vec)
	{
		return this.normal.dot(vec) + this.d;
	}
}

//Color with values ranging from 0-1
class Color
{
	//Initialize this color using set()
	constructor(r, g, b, a)
	{
		this.set(r, g, b, a);
	}
	
	//Set this color to (r, g, b, a), another Color object, or opaque black if no args were passed. Alpha defaults to 1 (opaque)
	set(r = 0, g = 0, b = 0, a = 1)
	{
		if(typeof r === "number")
		{
			this.r = r;
			this.g = g;
			this.b = b;
			this.a = a;
		}
		else
		{
			this.r = r.r;
			this.g = r.g;
			this.b = r.b;
			this.a = r.a;
		}
		
		return this;
	}
	
	//Multiply this color by another color
	mul(col)
	{
		this.r *= col.r;
		this.g *= col.g;
		this.b *= col.b;
		this.a *= col.a;
		return this;
	}
	
	//Add another color to this color
	add(col)
	{
		this.r += col.r;
		this.g += col.g;
		this.b += col.b;
		this.a += col.a;
		return this;
	}
	
	//Subtract another color from this color
	sub(col)
	{
		this.r -= col.r;
		this.g -= col.g;
		this.b -= col.b;
		this.a -= col.a;
		return this;
	}
	
	//Invert this color
	inv()
	{
		this.r = 1 - this.r;
		this.g = 1 - this.g;
		this.b = 1 - this.b;
		return this;
	}
	
	//Return red value converted to Uint8
	red()
	{
		return Math.round(this.r * 255);
	}
	
	//Return green value converted to Uint8
	green()
	{
		return Math.round(this.g * 255);
	}
	
	//Return blue value converted to Uint8
	blue()
	{
		return Math.round(this.b * 255);
	}
	
	//Return alpha value converted to Uint8
	alpha()
	{
		return Math.round(this.a * 255);
	}
	
	//Return hex color (#rrggbbaa)
	hex()
	{
		var r = this.red  ().toString(16).padStart(2, '0');
		var g = this.green().toString(16).padStart(2, '0');
		var b = this.blue ().toString(16).padStart(2, '0');
		var a = this.alpha().toString(16).padStart(2, '0');
		return '#' + r + g + b + a;
	}
}

//Matrix4 indices
const M00 = 0, M01 = 4, M02 =  8, M03 = 12;
const M10 = 1, M11 = 5, M12 =  9, M13 = 13;
const M20 = 2, M21 = 6, M22 = 10, M23 = 14;
const M30 = 3, M31 = 7, M32 = 11, M33 = 15;
const MI = new Matrix4();

const V0 = new Vector3(0, 0, 0);
const V1 = new Vector3(1, 1, 1);
const VX = new Vector3(1, 0, 0);
const VY = new Vector3(0, 1, 0);
const VZ = new Vector3(0, 0, 1);
const VNX = new Vector3(-1,  0,  0);
const VNY = new Vector3( 0, -1,  0);
const VNZ = new Vector3( 0,  0, -1);

const PIH = Math.PI / 2; //90 degrees
const PI = Math.PI; //180 degrees
const PI2 = 2 * Math.PI; //360 degrees

const RADDEG = 180 / PI; //Convert radians to degrees by multiplying
const DEGRAD = PI / 180; //Convert degrees to radians by multiplying

//Do not use
const __mjs_tmpMat1 = new Matrix4();
const __mjs_tmpMat2 = new Matrix4();
const __mjs_tmpQuat = new Quaternion();
const __mjs_tmpVec1 = new Vector3();
const __mjs_tmpVec2 = new Vector3();
const __mjs_tmpVec3 = new Vector3();
