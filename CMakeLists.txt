cmake_minimum_required(VERSION 3.10)
project(PhysX C CXX)

SET(PHYSX_ROOT_DIR $ENV{PHYSX_ROOT_DIR})
SET(PXSHARED_PATH $ENV{PM_PxShared_PATH})

ADD_LIBRARY(PhysX STATIC
	${PHYSX_ROOT_DIR}/source/foundation/src/PsAllocator.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/PsAssert.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/PsFoundation.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/PsMathUtils.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/PsString.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/PsTempAllocator.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/PsUtilities.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixAtomic.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixCpu.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixFPU.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixMutex.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixPrintString.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixSList.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixSocket.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixSync.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixThread.cpp
	${PHYSX_ROOT_DIR}/source/foundation/src/unix/PsUnixTime.cpp
	${PHYSX_ROOT_DIR}/source/common/src/CmCollection.cpp
	${PHYSX_ROOT_DIR}/source/common/src/CmMathUtils.cpp
	${PHYSX_ROOT_DIR}/source/common/src/CmPtrTable.cpp
	${PHYSX_ROOT_DIR}/source/common/src/CmRadixSort.cpp
	${PHYSX_ROOT_DIR}/source/common/src/CmRadixSortBuffered.cpp
	${PHYSX_ROOT_DIR}/source/common/src/CmRenderOutput.cpp
	${PHYSX_ROOT_DIR}/source/common/src/CmVisualization.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuBounds.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuCCTSweepTests.cpp	
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuGeometryQuery.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuGeometryUnion.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuInternal.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuMeshFactory.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuMetaData.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuMTD.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuOverlapTests.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuRaycastTests.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuSerialize.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuSweepMTD.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuSweepSharedTests.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuSweepTests.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuAABBTreeBuild.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/GuBVHStructure.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/ccd/GuCCDSweepConvexMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/ccd/GuCCDSweepPrimitives.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/common/GuBarycentricCoordinates.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/common/GuSeparatingAxes.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactBoxBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactCapsuleBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactCapsuleCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactCapsuleConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactCapsuleMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactConvexConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactConvexMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactPlaneBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactPlaneCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactPlaneConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactPolygonPolygon.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactSphereBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactSphereCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactSphereMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactSpherePlane.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuContactSphereSphere.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/contact/GuFeatureCode.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/convex/GuBigConvexData.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/convex/GuConvexHelper.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/convex/GuConvexMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/convex/GuConvexSupportTable.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/convex/GuConvexUtilsInternal.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/convex/GuHillClimbing.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/convex/GuShapeConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/distance/GuDistancePointBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/distance/GuDistancePointTriangle.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/distance/GuDistanceSegmentBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/distance/GuDistanceSegmentSegment.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/distance/GuDistanceSegmentTriangle.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/gjk/GuEPA.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/gjk/GuGJKSimplex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/gjk/GuGJKTest.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/hf/GuHeightField.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/hf/GuHeightFieldUtil.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/hf/GuOverlapTestsHF.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/hf/GuSweepsHF.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/intersection/GuIntersectionBoxBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/intersection/GuIntersectionCapsuleTriangle.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/intersection/GuIntersectionEdgeEdge.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/intersection/GuIntersectionRayBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/intersection/GuIntersectionRayCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/intersection/GuIntersectionRaySphere.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/intersection/GuIntersectionSphereBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/intersection/GuIntersectionTriangleBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4_AABBSweep.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4_BoxOverlap.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4_CapsuleSweep.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4_CapsuleSweepAA.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4_OBBSweep.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4_Raycast.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4_SphereOverlap.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4_SphereSweep.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuMidphaseBV4.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV4Build.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuMeshQuery.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuMidphaseRTree.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuOverlapTestsMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuRTree.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuRTreeQueries.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuSweepsMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuTriangleMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuTriangleMeshBV4.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuTriangleMeshRTree.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV32.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/mesh/GuBV32Build.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactBoxBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactBoxConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactCapsuleBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactCapsuleCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactCapsuleConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactCapsuleHeightField.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactCapsuleMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactConvexCommon.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactConvexConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactConvexHeightField.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactConvexMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactGenBoxConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactGenSphereCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactPlaneBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactPlaneCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactPlaneConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactSphereBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactSphereCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactSphereConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactSphereHeightField.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactSphereMesh.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactSpherePlane.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMContactSphereSphere.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMShapeConvex.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPCMTriangleContactGen.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/pcm/GuPersistentContactManifold.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepBoxBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepBoxSphere.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepBoxTriangle_FeatureBased.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepBoxTriangle_SAT.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepCapsuleBox.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepCapsuleCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepCapsuleTriangle.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepSphereCapsule.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepSphereSphere.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepSphereTriangle.cpp
	${PHYSX_ROOT_DIR}/source/geomutils/src/sweep/GuSweepTriangleUtils.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctBoxController.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctCapsuleController.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctCharacterController.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctCharacterControllerCallbacks.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctCharacterControllerManager.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctController.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctObstacleContext.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctSweptBox.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctSweptCapsule.cpp
	${PHYSX_ROOT_DIR}/source/physxcharacterkinematic/src/CctSweptVolume.cpp
	${PHYSX_ROOT_DIR}/source/physxmetadata/core/src/PxAutoGeneratedMetaDataObjects.cpp
	${PHYSX_ROOT_DIR}/source/physxmetadata/core/src/PxMetaDataObjects.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/buffering/ScbActor.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/buffering/ScbAggregate.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/buffering/ScbBase.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/buffering/ScbMetaData.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/buffering/ScbScene.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/buffering/ScbScenePvdClient.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/buffering/ScbShape.cpp
	${PHYSX_ROOT_DIR}/source/immediatemode/src/NpImmediateMode.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/device/linux/PhysXIndicatorLinux.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/gpu/PxGpu.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/gpu/PxPhysXGpuModuleLoader.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpActor.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpAggregate.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpArticulationReducedCoordinate.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpArticulation.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpArticulationJoint.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpArticulationJointReducedCoordinate.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpArticulationLink.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpBatchQuery.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpConstraint.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpFactory.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpMaterial.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpMetaData.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpPhysics.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpPvdSceneQueryCollector.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpReadCheck.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpRigidDynamic.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpRigidStatic.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpScene.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpSceneQueries.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpSerializerAdapter.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpShape.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpShapeManager.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/NpWriteCheck.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/PvdMetaDataPvdBinding.cpp
	${PHYSX_ROOT_DIR}/source/physx/src/PvdPhysicsClient.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/api/src/px_globals.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcContactCache.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcContactMethodImpl.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcMaterialHeightField.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcMaterialMesh.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcMaterialMethodImpl.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcMaterialShape.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcNpBatch.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcNpCacheStreamPair.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcNpContactPrepShared.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcNpMemBlockPool.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/common/src/pipeline/PxcNpThreadContext.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/software/src/PxsCCD.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/software/src/PxsContactManager.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/software/src/PxsContext.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/software/src/PxsDefaultMemoryManager.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/software/src/PxsIslandSim.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/software/src/PxsMaterialCombiner.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/software/src/PxsNphaseImplementationContext.cpp
	${PHYSX_ROOT_DIR}/source/lowlevel/software/src/PxsSimpleIslandManager.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpAABBManager.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpBroadPhase.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpBroadPhaseABP.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpBroadPhaseMBP.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpBroadPhaseSap.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpBroadPhaseSapAux.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpBroadPhaseShared.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpMBPTasks.cpp
	${PHYSX_ROOT_DIR}/source/lowlevelaabb/src/BpSAPTasks.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyArticulation.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyArticulationContactPrep.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyArticulationContactPrepPF.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyArticulationHelper.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyArticulationScalar.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyArticulationSIMD.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyFeatherstoneArticulation.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyFeatherstoneForwardDynamic.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyFeatherstoneInverseDynamic.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyConstraintPartition.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyConstraintSetup.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyConstraintSetupBlock.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyContactPrep.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyContactPrep4.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyContactPrep4PF.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyContactPrepPF.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyDynamics.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyFrictionCorrelation.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyRigidBodyToSolverBody.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DySolverConstraints.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DySolverConstraintsBlock.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DySolverControl.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DySolverControlPF.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DySolverPFConstraints.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DySolverPFConstraintsBlock.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyThreadContext.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyThresholdTable.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyTGSDynamics.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyTGSContactPrep.cpp
	${PHYSX_ROOT_DIR}/source/lowleveldynamics/src/DyTGSContactPrepBlock.cpp
	${PHYSX_ROOT_DIR}/source/task/src/TaskManager.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqAABBPruner.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqAABBTree.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqIncrementalAABBPruner.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqIncrementalAABBPrunerCore.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqIncrementalAABBTree.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqAABBTreeUpdateMap.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqBounds.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqCompoundPruner.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqCompoundPruningPool.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqBucketPruner.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqExtendedBucketPruner.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqMetaData.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqPruningPool.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqPruningStructure.cpp
	${PHYSX_ROOT_DIR}/source/scenequery/src/SqSceneQueryManager.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScActorCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScActorSim.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScArticulationCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScArticulationJointCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScArticulationJointSim.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScArticulationSim.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScBodyCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScBodySim.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScConstraintCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScConstraintGroupNode.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScConstraintInteraction.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScConstraintProjectionManager.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScConstraintProjectionTree.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScConstraintSim.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScElementInteractionMarker.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScElementSim.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScInteraction.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScIterators.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScMetaData.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScNPhaseCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScPhysics.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScRigidCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScRigidSim.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScScene.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScShapeCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScShapeInteraction.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScShapeSim.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScSimStats.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScSimulationController.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScSqBoundsManager.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScStaticCore.cpp
	${PHYSX_ROOT_DIR}/source/simulationcontroller/src/ScTriggerInteraction.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtBroadPhase.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtCollection.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtConvexMeshExt.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtCpuWorkerThread.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtD6Joint.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtD6JointCreate.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtDefaultCpuDispatcher.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtDefaultErrorCallback.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtDefaultSimulationFilterShader.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtDefaultStreams.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtDistanceJoint.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtContactJoint.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtExtensions.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtFixedJoint.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtJoint.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtMetaData.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtPrismaticJoint.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtPvd.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtPxStringTable.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtRaycastCCD.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtRevoluteJoint.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtRigidBodyExt.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtRigidActorExt.cpp	
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtSceneQueryExt.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtSimpleFactory.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtSmoothNormals.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtSphericalJoint.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/ExtTriangleMeshExt.cpp
	${PHYSX_ROOT_DIR}/source/physxmetadata/extensions/src/PxExtensionAutoGeneratedMetaDataObjects.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/SnSerialization.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/SnSerializationRegistry.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/SnSerialUtils.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Xml/SnJointRepXSerializer.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Xml/SnRepXCoreSerializer.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Xml/SnRepXUpgrader.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Xml/SnXmlSerialization.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnBinaryDeserialization.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnBinarySerialization.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnConvX.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnConvX_Align.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnConvX_Convert.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnConvX_Error.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnConvX_MetaData.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnConvX_Output.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnConvX_Union.cpp
	${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary/SnSerializationContext.cpp
	${PHYSX_ROOT_DIR}/source/fastxml/src/PsFastXml.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleComponents.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleDrive.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleDrive4W.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleDriveNW.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleDriveTank.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleMetaData.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleNoDrive.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleSDK.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleSerialization.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleSuspWheelTire4.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleTireFriction.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleUpdate.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/PxVehicleWheels.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/VehicleUtilControl.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/VehicleUtilSetup.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/VehicleUtilTelemetry.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/physxmetadata/src/PxVehicleAutoGeneratedMetaDataObjects.cpp
	${PHYSX_ROOT_DIR}/source/physxvehicle/src/physxmetadata/src/PxVehicleMetaDataObjects.cpp
)

TARGET_INCLUDE_DIRECTORIES(PhysX
	PRIVATE ${PHYSX_ROOT_DIR}/include
	PRIVATE ${PXSHARED_PATH}/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/foundation/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/foundation/include/linux
	PRIVATE ${PHYSX_ROOT_DIR}/source/common/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/common/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/physx/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/physx/src/device
	PRIVATE ${PHYSX_ROOT_DIR}/source/physx/src/buffering
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxgpu/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/contact
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/common
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/convex
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/distance
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/sweep
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/gjk
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/intersection
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/mesh
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/hf
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/pcm
	PRIVATE ${PHYSX_ROOT_DIR}/source/geomutils/src/ccd
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowleveldynamics/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowleveldynamics/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/simulationcontroller/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/simulationcontroller/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxcooking/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxcooking/src/mesh
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxcooking/src/convex
	PRIVATE ${PHYSX_ROOT_DIR}/source/scenequery/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxmetadata/core/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/immediatemode/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/pvd/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxmetadata/core/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxmetadata/extensions/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowlevel/api/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowlevel/common/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowlevel/common/include/collision
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowlevel/common/include/pipeline
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowlevel/common/include/utils
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowlevel/software/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/Common/src/linux
	PRIVATE ${PHYSX_ROOT_DIR}/source/LowLevel/software/include/linux
	PRIVATE ${PHYSX_ROOT_DIR}/source/LowLevelDynamics/include/linux
	PRIVATE ${PHYSX_ROOT_DIR}/source/LowLevel/common/include/pipeline/linux
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowlevelaabb/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowlevelaabb/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/LowLevelAABB/linux/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/GpuBroadPhase/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/GpuBroadPhase/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowleveldynamics/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/lowleveldynamics/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/cudamanager/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/scenequery/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/simulationcontroller/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/simulationcontroller/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxextensions/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Xml
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/Binary
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxextensions/src/serialization/File
	PRIVATE ${PHYSX_ROOT_DIR}/source/pvdsdk/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/fastxml/include
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxvehicle/src
	PRIVATE ${PHYSX_ROOT_DIR}/source/physxvehicle/src/physxmetadata/include
)

TARGET_COMPILE_OPTIONS(PhysX PRIVATE
	-fPIC -std=c++11 -fno-exceptions -ffunction-sections
	-fdata-sections -fstrict-aliasing -ferror-limit=0
	-Wall -Wextra -Werror -Wstrict-aliasing=2
	-Weverything -Wno-documentation-deprecated-sync
	-Wno-documentation-unknown-command -Wno-gnu-anonymous-struct
	-Wno-undef -Wno-unused-function -Wno-nested-anon-types
	-Wno-float-equal -Wno-padded -Wno-weak-vtables
	-Wno-cast-align -Wno-conversion -Wno-missing-noreturn
	-Wno-missing-variable-declarations -Wno-shift-sign-overflow
	-Wno-covered-switch-default -Wno-exit-time-destructors
	-Wno-global-constructors -Wno-missing-prototypes
	-Wno-unreachable-code -Wno-unused-macros
	-Wno-unused-member-function -Wno-used-but-marked-unused
	-Wno-weak-template-vtables -Wno-deprecated
	-Wno-non-virtual-dtor -Wno-invalid-noreturn
	-Wno-return-type-c-linkage -Wno-reserved-id-macro
	-Wno-c++98-compat-pedantic -Wno-unused-local-typedef
	-Wno-old-style-cast -Wno-newline-eof -Wno-alloca
	-Wno-unused-private-field -Wno-format-nonliteral
	-Wno-implicit-fallthrough -Wno-undefined-reinterpret-cast
	-Wno-disabled-macro-expansion -Wno-zero-as-null-pointer-constant
	-Wno-shadow -Wno-unknown-warning-option
	-Wno-atomic-implicit-seq-cst -Wno-extra-semi-stmt
	-Wall -Werror -Wno-invalid-offsetof -Wno-uninitialized -O3)

TARGET_COMPILE_DEFINITIONS(PhysX
	PRIVATE "NDEBUG;PX_SUPPORT_PVD=0;PX_SIMD_DISABLED"
)

SET_TARGET_PROPERTIES(PhysX PROPERTIES
	OUTPUT_NAME PhysX
)
