#!/bin/bash +x

if [[ ! -d PhysX ]]; then
	git clone https://github.com/NVIDIAGameWorks/PhysX.git
	cd PhysX
	git reset --hard ae80dede0546d652040ae6260a810e53e20a06fa #8-13-19 4.1.1.27006925 (updating would be a huge pain in the anal)
	sed -i "s/PX_APPLE_FAMILY/PX_APPLE_FAMILY || __EMSCRIPTEN__/g" physx/source/foundation/include/PsHash.h
	cd ..
fi

export WORKING_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
export PHYSX_ROOT_DIR="$WORKING_DIR/PhysX/physx"
export PM_PxShared_PATH="$WORKING_DIR/PhysX/pxshared"

mkdir -p build
cd build
cmake .. -DCMAKE_C_COMPILER=emcc -DCMAKE_CXX_COMPILER=em++ -DCMAKE_AR=$EMSDK/upstream/emscripten/emar --no-warn-unused-cli
make -j`grep -c processor /proc/cpuinfo`

emcc -I$PHYSX_ROOT_DIR/include -I$PM_PxShared_PATH/include -I$WORKING_DIR/bindings -DNDEBUG -O3 -std=c++17 \
-s NO_EXIT_RUNTIME=1 -s NO_FILESYSTEM=1 -s MODULARIZE=1 -s ALLOW_MEMORY_GROWTH=1 \
-s EXPORT_NAME=initPhysX --bind -o physx.js libPhysX.a $WORKING_DIR/bindings/embind.cpp
