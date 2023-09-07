import * as THREE from 'three'
import React, { useMemo, useRef } from 'react'
import { Suspense } from 'react'
import ReactDOM from "react-dom"
import { Canvas, extend, useThree, useLoader, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, Sky, useProgress, Html } from '@react-three/drei'
import { Stats, OrbitControls } from '@react-three/drei'
import { Water} from 'three-stdlib'

import World17 from './World17'

extend({ Water })

function Ocean() {
  const ref = useRef()
  const gl = useThree((state) => state.gl)
  const waterNormals = useLoader(THREE.TextureLoader, 'waternormals.jpeg')
  waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping
  const geom = useMemo(() => new THREE.PlaneGeometry(160, 160), [])
  const config = useMemo(
      () => ({
          textuerWidth: 512,
          textureHeight: 512,
          waterNormals,
          sunDirection: new THREE.Vector3(),
          sunColor: 0xffffff,
          waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: false,
          format: gl.encoding
      }),
      [waterNormals]
  )
  useFrame((state, delta) => (ref.current.material.uniforms.time.value += delta))
  return <water ref={ref} args={[geom, config]} rotation-x={-Math.PI / 2 } />
}

function Loader() {
  const { progress } = useProgress()
  return <Html center> <div className='loading'>{progress}% </div></Html>
}

export default function App() {
  return (
    <div className="App">
      <Canvas shadows camera={{ fov: 15.5, position: [-60, 30, 50] }}>
        <Suspense fallback={<Loader/>}>
          {/* <pointLight position={[100, 100, 100]} intensity={1}/>
          <pointLight position={[-100, -100, -100]} intensity={1}/> */}
          <ambientLight intensity={0.1} />
          {/* <primitive object={new THREE.AxesHelper(10)} /> */}
          {/* <Ocean /> */}
          <World17 position={[0, 0, 0.5]} />

          <Environment preset="forest" />
        </Suspense>
        {/* <Sky scale={160} sunPosition={[-500, 150, -1000]} turbidity={0.1} /> */}
        <OrbitControls  
          minPolarAngle={Math.PI / 3.5}
          maxPolarAngle={Math.PI / 3.5}
          enableZoom={false}
        />
        <Stats />
      </Canvas>
    </div>
  )
}
