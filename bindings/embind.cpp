#include <emscripten/bind.h>
#include "mom.hpp"
#include "PxPhysicsAPI.h"

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
	
	//ugly hax
	function("js_SceneDesc_filterShader_setDefault", optional_override([](PxSceneDesc& desc)
	{
		desc.filterShader = PxDefaultSimulationFilterShader;
	}));
	
	function("js_Scene_simulate", optional_override([](PxScene& scene, PxReal elapsedTime)
	{
		scene.simulate(elapsedTime);
	}));
	
	function("js_Scene_fetchResults", optional_override([](PxScene& scene, bool block)
	{
		return scene.fetchResults(block);
	}));
	
	//classes/enums
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
			.function("createRigidDynamic", &PxPhysics::createRigidDynamic);
	class_<PxTolerancesScale>("TolerancesScale")
			.constructor<>();
	class_<PxPvd>("Pvd");
	class_<PxSceneDesc>("SceneDesc")
			.constructor<const PxTolerancesScale&>()
			.property("gravity", &PxSceneDesc::gravity)
			.property("cpuDispatcher", &PxSceneDesc::cpuDispatcher);
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
			.function("removeActor", &PxScene::removeActor);
	class_<PxMaterial>("Material");
	class_<PxPlane>("Plane")
			.constructor<float, float, float, float>();
	class_<PxActor>("Actor");
	class_<PxRigidActor, base<PxActor>>("PxRigidActor")
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
	class_<PxShape>("Shape");
	class_<PxShapeFlags>("ShapeFlags").constructor<PxU32>();
	enum_<PxShapeFlag::Enum>("ShapeFlag")
			.value("eSIMULATION_SHAPE", PxShapeFlag::eSIMULATION_SHAPE)
			.value("eSCENE_QUERY_SHAPE", PxShapeFlag::eSCENE_QUERY_SHAPE)
			.value("eTRIGGER_SHAPE", PxShapeFlag::eTRIGGER_SHAPE)
			.value("eVISUALIZATION", PxShapeFlag::eVISUALIZATION);
	class_<PxRigidBody, base<PxRigidActor>>("RigidBody")
			.function("getLinearVelocity", &PxRigidBody::getLinearVelocity)
			.function("setLinearVelocity", &PxRigidBody::setLinearVelocity);
	class_<PxRigidDynamic, base<PxRigidBody>>("PxRigidDynamic");
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
}

namespace emscripten
{
	namespace internal
	{
		//some physx classes have a release() method instead of a destructor
		template<> void raw_destructor<PxFoundation>(PxFoundation* ptr) { ptr->release(); }
		template<> void raw_destructor<PxPvd>(PxPvd* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxScene>(PxScene* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxMaterial>(PxMaterial* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxActor>(PxActor* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxRigidActor>(PxRigidActor* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxRigidStatic>(PxRigidStatic* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxRigidBody>(PxRigidBody* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxBVHStructure>(PxBVHStructure* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxShape>(PxShape* ptr) { ptr-> release(); }
		template<> void raw_destructor<PxRigidDynamic>(PxRigidDynamic* ptr) { ptr-> release(); }
	}
}
