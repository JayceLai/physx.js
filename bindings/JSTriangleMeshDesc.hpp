#include <vector>
#include "PxPhysicsAPI.h"

namespace physx
{
	class JSTriangleMeshDesc : public PxTriangleMeshDesc
	{
		public:
			JSTriangleMeshDesc();
			void point(PxReal x, PxReal y, PxReal z);
			void triangle(PxU32 t1, PxU32 t2, PxU32 t3);
		
		private:
			std::vector<PxVec3> pointVec;
			std::vector<PxU32> triangleVec;
	};

	JSTriangleMeshDesc::JSTriangleMeshDesc()
	{
		points.stride = sizeof(PxVec3);
		triangles.stride = 3 * sizeof(PxU32);
	}
	
	void JSTriangleMeshDesc::point(PxReal x, PxReal y, PxReal z)
	{
		pointVec.push_back(PxVec3(x, y, z));
		points.data = &pointVec[0];
		points.count++;
	}
	
	void JSTriangleMeshDesc::triangle(PxU32 t1, PxU32 t2, PxU32 t3)
	{
		triangleVec.push_back(t1);
		triangleVec.push_back(t2);
		triangleVec.push_back(t3);
		triangles.data = &triangleVec[0];
		triangles.count++;
	}
}
