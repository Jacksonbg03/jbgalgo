import React from 'react'
import {Suspense, useEffect, useState, useRef} from "react"
import {Canvas, useFrame} from "@react-three/fiber"
import {OrbitControls, Preload, useGLTF, useAnimations} from "@react-three/drei"
import CanvasLoader from './Loader'
import * as THREE from 'three'

const Model = () => {
    const group = useRef()
    const { scene, animations } = useGLTF("/DROID.glb")
    const { actions, names } = useAnimations(animations, group)
    const [hovered, setHovered] = useState(false)
    const[time, setTime] = useState(0)

    useEffect(() => {
        if (group.current) {
            group.current.rotation.x = -0.2  // miring vertikal sedikit
            group.current.rotation.y = -0.5  // miring horizontal
            group.current.rotation.z = -0.2  // miring horizontal
        }
    }, [])

    useEffect(() => {
        if (!names.length) return

        names.forEach(name => {
            const action = actions[name]
            if (!action) return

            if (hovered) {
                // Play normal
                action.setEffectiveTimeScale(0.1)
                action.reset()
                action.play()
                action.loop = THREE.LoopRepeat
            } else {
                // Play reverse dari posisi terakhir
                action.setEffectiveTimeScale(-0.1)
                action.loop = THREE.LoopOnce
                action.clampWhenFinished = true
                action.play()
            }
        })
    }, [hovered, actions, names])

    useFrame((state, delta) => {
        if (group.current) {
            // Naik turun perlahan (breathing)
            setTime(prev => prev + delta)
            group.current.position.y = 0 + Math.sin(time * 2) * 0.1  // amplitude 0.1
            // Muter pelan horizontal
            if (!hovered) group.current.rotation.y += -0.002
        }
    })

    return (
        <group ref={group}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}>
            <hemisphereLight intensity={5} groundColor="black"/>
            <pointLight intensity={1}/>
            <primitive object={scene} scale={1.5} position={[0, -4.25, 0]}/>
        </group>
    )
}

const ModelCanvas = ()=>{
    return(
        <Canvas frameloop='demand' shadows camera={{position: [-20, 2, 0], fov: 25}} gl={{preserveDrawingBuffer: true}}>
            <Suspense fallback={<CanvasLoader/>}>
                <OrbitControls enableZoom={false} enablePan={true} maxPolarAngle={Math.PI} minPolarAngle={0}/>
                <Model/>
            </Suspense>
            
            <Preload all/>
        </Canvas>
    )
}
export default ModelCanvas;