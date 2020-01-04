#include <emscripten/bind.h>
#include "PxPhysicsAPI.h"

#include "mom.hpp"
#include "MeshDesc.hpp"

using namespace emscripten;
using namespace physx;

//feel free to add more and submit a PR
//learn how:
//https://emscripten.org/docs/porting/connecting_cpp_and_javascript/embind.html

EMSCRIPTEN_BINDINGS(physxjs)
{
	//constants
	constant("PHYSICS_VERSION", PX_PHYSICS_VERSION);
	
	//global functions
	function("CreateFoundation", &PxCreateFoundation);
	function("CreatePhysics", &PxCreatePhysics);
	function("DefaultCpuDispatcherCreate", optional_override([]() { return PxDefaultCpuDispatcherCreate(0); }));
	function("CreatePlane", &PxCreatePlane);
	function("CreateDynamic", (PxRigidDynamic*(*)(PxPhysics&, const PxTransform&, const PxGeometry&, PxMaterial&, PxReal density, const PxTransform&)) &PxCreateDynamic);
	function("CreateCooking", &PxCreateCooking);
	function("CreateControllerManager", &PxCreateControllerManager);
	
	//enums
	enum_<PxShapeFlag::Enum>("ShapeFlag")
			.value("eSIMULATION_SHAPE", PxShapeFlag::eSIMULATION_SHAPE)
			.value("eSCENE_QUERY_SHAPE", PxShapeFlag::eSCENE_QUERY_SHAPE)
			.value("eTRIGGER_SHAPE", PxShapeFlag::eTRIGGER_SHAPE)
			.value("eVISUALIZATION", PxShapeFlag::eVISUALIZATION);
	enum_<PxControllerCollisionFlag::Enum>("ControllerCollisionFlag")
			.value("eCOLLISION_SIDES", PxControllerCollisionFlag::eCOLLISION_SIDES)
			.value("eCOLLISION_UP", PxControllerCollisionFlag::eCOLLISION_UP)
			.value("eCOLLISION_DOWN", PxControllerCollisionFlag::eCOLLISION_DOWN);
	enum_<PxHitFlag::Enum>("HitFlag")
			.value("ePOSITION", PxHitFlag::ePOSITION)
			.value("eNORMAL", PxHitFlag::eNORMAL)
			.value("eUV", PxHitFlag::eUV)
			.value("eASSUME_NO_INITIAL_OVERLAP", PxHitFlag::eASSUME_NO_INITIAL_OVERLAP)
			.value("eMESH_MULTIPLE", PxHitFlag::eMESH_MULTIPLE)
			.value("eMESH_ANY", PxHitFlag::eMESH_ANY)
			.value("eMESH_BOTH_SIDES", PxHitFlag::eMESH_BOTH_SIDES)
			.value("ePRECISE_SWEEP", PxHitFlag::ePRECISE_SWEEP)
			.value("eMTD", PxHitFlag::eMTD)
			.value("eFACE_INDEX", PxHitFlag::eFACE_INDEX)
			.value("eDEFAULT", PxHitFlag::eDEFAULT)
			.value("eMODIFIABLE_FLAGS", PxHitFlag::eMODIFIABLE_FLAGS);
	enum_<PxConvexFlag::Enum>("ConvexFlag")
			.value("e16_BIT_INDICES", PxConvexFlag::e16_BIT_INDICES)
			.value("eCOMPUTE_CONVEX", PxConvexFlag::eCOMPUTE_CONVEX)
			.value("eCHECK_ZERO_AREA_TRIANGLES", PxConvexFlag::eCHECK_ZERO_AREA_TRIANGLES)
			.value("eQUANTIZE_INPUT", PxConvexFlag::eQUANTIZE_INPUT)
			.value("eDISABLE_MESH_VALIDATION", PxConvexFlag::eDISABLE_MESH_VALIDATION)
			.value("ePLANE_SHIFTING", PxConvexFlag::ePLANE_SHIFTING)
			.value("eFAST_INERTIA_COMPUTATION", PxConvexFlag::eFAST_INERTIA_COMPUTATION)
			.value("eGPU_COMPATIBLE", PxConvexFlag::eGPU_COMPATIBLE)
			.value("eSHIFT_VERTICES", PxConvexFlag::eSHIFT_VERTICES);
	enum_<PxMeshGeometryFlag::Enum>("MeshGeometryFlag")
			.value("eDOUBLE_SIDED", PxMeshGeometryFlag::eDOUBLE_SIDED);
	enum_<PxConvexMeshGeometryFlag::Enum>("ConvexMeshGeometryFlag")
			.value("eTIGHT_BOUNDS", PxConvexMeshGeometryFlag::eTIGHT_BOUNDS);
			
	//classes
	class_<PxFoundation>("Foundation");
	class_<PxAllocatorCallback>("AllocatorCallback");
	class_<PxErrorCallback>("ErrorCallback");
	class_<PxDefaultAllocator, base<PxAllocatorCallback>>("DefaultAllocator")
			.constructor<>();
	class_<PxDefaultErrorCallback, base<PxErrorCallback>>("DefaultErrorCallback")
			.constructor<>();
	class_<PxPhysics>("Physics")
			.function("createScene", &PxPhysics::createScene)
			.function("createMaterial", &PxPhysics::createMaterial)
			.function("createShape", (PxShape*(PxPhysics::*)(const PxGeometry&, const PxMaterial&, bool, PxShapeFlags)) &PxPhysics::createShape)
			.function("createRigidDynamic", &PxPhysics::createRigidDynamic)
			.function("createRigidStatic", &PxPhysics::createRigidStatic)
			.function("getPhysicsInsertionCallback", &PxPhysics::getPhysicsInsertionCallback);
	class_<PxTolerancesScale>("TolerancesScale")
			.constructor<>();
	class_<PxPvd>("Pvd");
	class_<PxSceneDesc>("SceneDesc")
			.constructor<const PxTolerancesScale&>()
			.property("gravity", &PxSceneDesc::gravity)
			.property("cpuDispatcher", &PxSceneDesc::cpuDispatcher)
			.function("filterShader_setDefault", select_overload<void(PxSceneDesc&)>([](PxSceneDesc& self)
			{
				self.filterShader = PxDefaultSimulationFilterShader;
			}));
	class_<PxVec3>("Vec3")
			.constructor<float, float, float>()
			.property("x", &PxVec3::x)
			.property("y", &PxVec3::y)
			.property("z", &PxVec3::z)
			.function("op_mul", &PxVec3::operator*=);
	class_<PxCpuDispatcher>("CpuDispatcher");
	class_<PxDefaultCpuDispatcher, base<PxCpuDispatcher>>("DefaultCpuDispatcher");
	class_<PxScene>("Scene")
			.function("addActor", &PxScene::addActor)
			.function("removeActor", &PxScene::removeActor)
			.function("simulate", select_overload<void(PxScene&, PxReal)>([](PxScene& self, PxReal elapsedTime)
			{
				self.simulate(elapsedTime);
			}))
			.function("fetchResults", select_overload<bool(PxScene&, bool)>([](PxScene& self, bool block)
			{
				return self.fetchResults(block);
			}))
			.function("raycast", &PxScene::raycast);
	class_<PxMaterial>("Material")
			.function("getDynamicFriction", &PxMaterial::getDynamicFriction)
			.function("setDynamicFriction", &PxMaterial::setDynamicFriction)
			.function("getStaticFriction", &PxMaterial::getStaticFriction)
			.function("setStaticFriction", &PxMaterial::setStaticFriction)
			.function("getRestitution", &PxMaterial::getRestitution)
			.function("setRestitution", &PxMaterial::setRestitution);
	class_<PxPlane>("Plane")
			.constructor<float, float, float, float>();
	class_<PxActor>("Actor");
	class_<PxRigidActor, base<PxActor>>("RigidActor")
			.function("attachShape", &PxRigidActor::attachShape)
			.function("getGlobalPose", &PxRigidActor::getGlobalPose)
			.function("setGlobalPose", &PxRigidActor::setGlobalPose);
	class_<PxRigidStatic, base<PxRigidActor>>("RigidStatic");
	class_<PxBVHStructure>("BVHStructure");
	class_<PxTransform>("Transform")
			.constructor<const PxMat44&>()
			.function("transform", (PxTransform(PxTransform::*)(const PxTransform&) const) &PxTransform::transform)
			.property("q", &PxTransform::q)
			.property("p", &PxTransform::p);
	class_<PxGeometry>("Geometry");
	class_<PxBoxGeometry, base<PxGeometry>>("BoxGeometry")
			.constructor<PxReal, PxReal, PxReal>();
	class_<PxShape>("Shape")
			.function("setSimulationFilterData", &PxShape::setSimulationFilterData)
			.function("setQueryFilterData", &PxShape::setQueryFilterData);
	class_<PxShapeFlags>("ShapeFlags")
			.constructor<PxU32>();
	class_<PxRigidBody, base<PxRigidActor>>("RigidBody")
			.function("getLinearVelocity", &PxRigidBody::getLinearVelocity)
			.function("setLinearVelocity", &PxRigidBody::setLinearVelocity);
	class_<PxRigidDynamic, base<PxRigidBody>>("RigidDynamic")
			.function("getMaxAngularVelocity", &PxRigidDynamic::getMaxAngularVelocity)
			.function("setMaxAngularVelocity", &PxRigidDynamic::setMaxAngularVelocity)
			.function("getAngularDamping", &PxRigidDynamic::getAngularDamping)
			.function("setAngularDamping", &PxRigidDynamic::setAngularDamping);
	class_<PxRigidBodyExt>("RigidBodyExt")
			.class_function("updateMassAndInertia", (bool(*)(PxRigidBody&, PxReal, const PxVec3*, bool)) &PxRigidBodyExt::updateMassAndInertia);
	class_<PxQuat>("Quat")
			.constructor<float, float, float, float>()
			.property("x", &PxQuat::x)
			.property("y", &PxQuat::y)
			.property("z", &PxQuat::z)
			.property("w", &PxQuat::w);
	value_array<PxMat44>("Mat44")
			.element(MOM_POINTER(PxMat44, column0.x))
			.element(MOM_POINTER(PxMat44, column0.y))
			.element(MOM_POINTER(PxMat44, column0.z))
			.element(MOM_POINTER(PxMat44, column0.w))
			.element(MOM_POINTER(PxMat44, column1.x))
			.element(MOM_POINTER(PxMat44, column1.y))
			.element(MOM_POINTER(PxMat44, column1.z))
			.element(MOM_POINTER(PxMat44, column1.w))
			.element(MOM_POINTER(PxMat44, column2.x))
			.element(MOM_POINTER(PxMat44, column2.y))
			.element(MOM_POINTER(PxMat44, column2.z))
			.element(MOM_POINTER(PxMat44, column2.w))
			.element(MOM_POINTER(PxMat44, column3.x))
			.element(MOM_POINTER(PxMat44, column3.y))
			.element(MOM_POINTER(PxMat44, column3.z))
			.element(MOM_POINTER(PxMat44, column3.w));
	class_<PxCapsuleGeometry, base<PxGeometry>>("CapsuleGeometry")
			.constructor<PxReal, PxReal>();
	class_<PxCookingParams>("CookingParams")
			.constructor<const PxTolerancesScale&>();
	class_<PxCooking>("Cooking")
			.function("createTriangleMesh", select_overload<PxTriangleMesh*(PxCooking&, const PxTriangleMeshDesc&, PxPhysicsInsertionCallback&)>([](PxCooking& self, const PxTriangleMeshDesc& desc, PxPhysicsInsertionCallback& insertionCallback)
			{
				return self.createTriangleMesh(desc, insertionCallback);
			}))
			.function("createConvexMesh", select_overload<PxConvexMesh*(PxCooking&, const PxConvexMeshDesc&, PxPhysicsInsertionCallback&)>([](PxCooking& self, const PxConvexMeshDesc& desc, PxPhysicsInsertionCallback& insertionCallback)
			{
				return self.createConvexMesh(desc, insertionCallback);
			}))
			.function("validateTriangleMesh", &PxCooking::validateTriangleMesh)
			.function("validateConvexMesh", &PxCooking::validateTriangleMesh);
	class_<PxTriangleMeshDesc>("TriangleMeshDescImpl");
	class_<PxConvexMeshDesc>("ConvexMeshDescImpl")
			.property("flags", &PxConvexMeshDesc::flags);
	class_<JSTriangleMeshDesc, base<PxTriangleMeshDesc>>("TriangleMeshDesc")
			.constructor<>()
			.function("point", &JSTriangleMeshDesc::point)
			.function("triangle", &JSTriangleMeshDesc::triangle);
	class_<JSConvexMeshDesc, base<PxConvexMeshDesc>>("ConvexMeshDesc")
			.constructor<>()
			.function("point", &JSConvexMeshDesc::point);
	class_<PxTriangleMesh>("TriangleMesh");
	class_<PxConvexMesh>("ConvexMesh");
	class_<PxPhysicsInsertionCallback>("PhysicsInsertionCallback");
	class_<PxTriangleMeshGeometry, base<PxGeometry>>("TriangleMeshGeometry")
			.constructor<PxTriangleMesh*, const PxMeshScale&, PxMeshGeometryFlags>();
	class_<PxConvexMeshGeometry, base<PxGeometry>>("ConvexMeshGeometry")
			.constructor<PxConvexMesh*, const PxMeshScale&, PxConvexMeshGeometryFlags>();
	class_<PxMeshScale>("MeshScale")
			.constructor<>();
	class_<PxMeshGeometryFlags>("MeshGeometryFlags")
			.constructor<>();
	class_<PxConvexMeshGeometryFlags>("ConvexMeshGeometryFlags")
			.constructor<>();
	class_<PxControllerManager>("ControllerManager")
			.function("createController", &PxControllerManager::createController);
	class_<PxControllerDesc>("ControllerDesc")
			.property("material", &PxControllerDesc::material)
			.property("slopeLimit", &PxControllerDesc::slopeLimit)
			.property("scaleCoeff", &PxControllerDesc::scaleCoeff)
			.property("contactOffset", &PxControllerDesc::contactOffset)
			.property("stepOffset", &PxControllerDesc::stepOffset);
	class_<PxCapsuleControllerDesc, base<PxControllerDesc>>("CapsuleControllerDesc")
			.constructor<>()
			.property("radius", &PxCapsuleControllerDesc::radius)
			.property("height", &PxCapsuleControllerDesc::height);
	class_<PxBoxControllerDesc, base<PxControllerDesc>>("BoxControllerDesc")
			.constructor<>()
			.property("halfHeight", &PxBoxControllerDesc::halfHeight)
			.property("halfSideExtent", &PxBoxControllerDesc::halfSideExtent)
			.property("halfForwardExtent", &PxBoxControllerDesc::halfForwardExtent);
	class_<PxController>("Controller")
			.function("move", &PxController::move)
			.function("getPosition", select_overload<PxVec3(PxController&)>([](PxController& self)
			{
				return toVec3(self.getPosition());
			}))
			.function("setPosition", select_overload<bool(PxController&, const PxVec3&)>([](PxController& self, const PxVec3& position)
			{
				return self.setPosition(PxExtendedVec3(float(position.x), float(position.y), float(position.z)));
			}));
	class_<PxControllerFilters>("ControllerFilters")
			.constructor<const PxFilterData*, PxQueryFilterCallback*, PxControllerFilterCallback*>();
	class_<PxFilterData>("FilterData")
			.constructor<PxU32, PxU32, PxU32, PxU32>()
			.property("word0", &PxFilterData::word0)
			.property("word1", &PxFilterData::word1)
			.property("word2", &PxFilterData::word2)
			.property("word3", &PxFilterData::word3);
	class_<PxQueryFilterCallback>("QueryFilterCallback");
	class_<PxControllerFilterCallback>("ControllerFilterCallback");
	class_<PxObstacleContext>("ObstacleContext");
	class_<PxControllerCollisionFlags>("ControllerCollisionFlags")
			.function("eCOLLISION_SIDES", select_overload<bool(PxControllerCollisionFlags&)>([](PxControllerCollisionFlags& self)
			{
				return (self & PxControllerCollisionFlag::eCOLLISION_SIDES) == PxControllerCollisionFlag::eCOLLISION_SIDES;
			}))
			.function("eCOLLISION_UP", select_overload<bool(PxControllerCollisionFlags&)>([](PxControllerCollisionFlags& self)
			{
				return (self & PxControllerCollisionFlag::eCOLLISION_UP) == PxControllerCollisionFlag::eCOLLISION_UP;
			}))
			.function("eCOLLISION_DOWN", select_overload<bool(PxControllerCollisionFlags&)>([](PxControllerCollisionFlags& self)
			{
				return (self & PxControllerCollisionFlag::eCOLLISION_DOWN) == PxControllerCollisionFlag::eCOLLISION_DOWN;
			}));
	class_<PxRaycastCallback>("RaycastCallback")
			.property("block", &PxRaycastCallback::block);
	class_<PxLocationHit>("LocationHit")
			.property("position", &PxLocationHit::position)
			.property("normal", &PxLocationHit::normal)
			.property("distance", &PxLocationHit::distance);
	class_<PxRaycastHit, base<PxLocationHit>>("RaycastHit");
	class_<PxRaycastBuffer, base<PxRaycastCallback>>("RaycastBuffer")
			.constructor<>();
	class_<PxHitFlags>("HitFlags")
			.constructor<PxU32>();
	class_<PxQueryFilterData>("QueryFilterData")
			.constructor<>()
			.property("data", &PxQueryFilterData::data);
	class_<PxQueryCache>("QueryCache");
	class_<PxConvexFlags>("ConvexFlags")
			.constructor<PxU32>();
}

namespace emscripten
{
	namespace internal
	{
		//some physx classes have a release() method instead of a destructor
		template<> void raw_destructor<PxFoundation>(PxFoundation* ptr) { ptr->release(); }
		template<> void raw_destructor<PxPvd>(PxPvd* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxPhysics>(PxPhysics* ptr) { ptr->release(); }
		template<> void raw_destructor<PxScene>(PxScene* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxMaterial>(PxMaterial* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxActor>(PxActor* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxRigidActor>(PxRigidActor* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxRigidStatic>(PxRigidStatic* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxRigidBody>(PxRigidBody* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxBVHStructure>(PxBVHStructure* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxShape>(PxShape* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxRigidDynamic>(PxRigidDynamic* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxCooking>(PxCooking* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxTriangleMesh>(PxTriangleMesh* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxConvexMesh>(PxConvexMesh* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxControllerManager>(PxControllerManager* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxController>(PxController* ptr) { ptr-> release(); }
		
		//can't be manually destructed or constructed
		template<> void raw_destructor<PxPhysicsInsertionCallback>(PxPhysicsInsertionCallback* ptr) {}
		template<> void raw_destructor<PxControllerDesc>(PxControllerDesc* ptr) {}
	}
}
