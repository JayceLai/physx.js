#include <emscripten/bind.h>
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
	function("CreateFoundation", &PxCreateFoundation, allow_raw_pointers());
	function("CreatePhysics", &PxCreatePhysics, allow_raw_pointers());
	function("DefaultCpuDispatcherCreate", optional_override([]() { return PxDefaultCpuDispatcherCreate(0); }), allow_raw_pointers());
	function("CreatePlane", &PxCreatePlane, allow_raw_pointers());
	function("CreateDynamic", (PxRigidDynamic*(*)(PxPhysics&, const PxTransform&, const PxGeometry&, PxMaterial&, PxReal density, const PxTransform&)) &PxCreateDynamic, allow_raw_pointers());
	
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
			.function("createScene", &PxPhysics::createScene, allow_raw_pointers())
			.function("createMaterial", &PxPhysics::createMaterial, allow_raw_pointers())
			.function("createShape", (PxShape*(PxPhysics::*)(const PxGeometry&, const PxMaterial&, bool, PxShapeFlags)) &PxPhysics::createShape, allow_raw_pointers())
			.function("createRigidDynamic", &PxPhysics::createRigidDynamic, allow_raw_pointers());
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
			.function("op_mul", &PxVec3::operator*=); //seems to trigger a bug in embind that duplicates the vec and leaks memory
	class_<PxCpuDispatcher>("CpuDispatcher");
	class_<PxDefaultCpuDispatcher, base<PxCpuDispatcher>>("DefaultCpuDispatcher");
	class_<PxScene>("Scene")
			.function("addActor", &PxScene::addActor, allow_raw_pointers())
			.function("removeActor", &PxScene::removeActor);
	class_<PxMaterial>("Material");
	class_<PxPlane>("Plane")
			.constructor<float, float, float, float>();
	class_<PxActor>("Actor");
	class_<PxRigidActor, base<PxActor>>("PxRigidActor")
			.function("attachShape", &PxRigidActor::attachShape)
			.function("getGlobalPose", &PxRigidActor::getGlobalPose);
	class_<PxRigidStatic, base<PxRigidActor>>("RigidStatic");
	class_<PxBVHStructure>("BVHStructure");
	class_<PxTransform>("Transform")
			.constructor<const PxVec3&>()
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
			.function("setLinearVelocity", &PxRigidBody::setLinearVelocity);
	class_<PxRigidDynamic, base<PxRigidBody>>("PxRigidDynamic");
	class_<PxRigidBodyExt>("RigidBodyExt")
			.class_function("updateMassAndInertia", (bool(*)(PxRigidBody&, PxReal, const PxVec3*, bool)) &PxRigidBodyExt::updateMassAndInertia, allow_raw_pointers());
	class_<PxQuat>("Quat")
			.constructor<float, float, float, float>()
			.property("x", &PxQuat::x)
			.property("y", &PxQuat::y)
			.property("z", &PxQuat::z)
			.property("w", &PxQuat::w);
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
		
		//embind does not seem to have an easy way of allowing raw pointers in the property() method
		template<> struct TypeID<PxCpuDispatcher*> { static constexpr TYPEID get() { return LightTypeID<PxCpuDispatcher*>::get(); } };
	}
}
