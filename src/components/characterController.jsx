import React, { useRef } from 'react';
import { Character } from './Character';
import { CapsuleCollider, RigidBody } from '@react-three/rapier';
import { MathUtils, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import { useControls } from 'leva';
import { useKeyboardControls } from '@react-three/drei';
import { degToRad } from 'three/src/math/MathUtils.js';

export const CharacterController = () =>
{
    const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls('Character Control', {
        WALK_SPEED: {
            value: 0.8,
            min: 0.1,
            max: 4,
            step: 0.1,
        },
        RUN_SPEED: {
            value: 1.4,
            min: 1,
            max: 2,
            step: 0.1,
        },
        ROTATION_SPEED: {
            value: degToRad(0.5),
            min: degToRad(0.1),
            max: degToRad(5),
            step: degToRad(0.1),
        },
    });

    const rotationTargetRef = useRef(0);
    const characterRotationTargetRef = useRef(0);
    const rigidBodyRef = useRef();
    const containerRef = useRef();
    const cameraTargetRef = useRef();
    const cameraPositionRef = useRef();
    const characterRef = useRef();
    const cameraWorldPositionRef = useRef(new Vector3());
    const cameraLookAtWorldPositionRef = useRef(new Vector3());
    const cameraLookAtRef = useRef(new Vector3());
    const [_, get] = useKeyboardControls();

    useFrame(({ camera }) =>
    {
        if (rigidBodyRef.current)
        {
            const velocity = rigidBodyRef.current.linvel();
            const movement = { x: 0, z: 0 };

            if (get().forward)
            {
                movement.z = 1;
            }
            if (get().backward)
            {
                movement.z = -1;
            }
            if (get().right)
            {
                movement.x = -1;
            }
            if (get().left)
            {
                movement.x = 1;
            }

            let speed = get().run ? RUN_SPEED : WALK_SPEED;

            if (movement.x !== 0)
            {
                rotationTargetRef.current += ROTATION_SPEED * movement.x;
            }

            if (movement.x !== 0 || movement.z !== 0)
            {
                characterRotationTargetRef.current = Math.atan2(movement.x, movement.z);
                velocity.x = Math.sin(characterRotationTargetRef.current  ) * speed;
                velocity.z = Math.cos(characterRotationTargetRef.current  ) * speed;
            }

            rigidBodyRef.current.setLinvel(velocity, true);
        }

        // Camera
        containerRef.current.rotation.y = MathUtils.lerp(
            containerRef.current.rotation.y,
            rotationTargetRef.current,
            0.1
        );

        cameraPositionRef.current.getWorldPosition(cameraWorldPositionRef.current);
        camera.position.lerp(cameraWorldPositionRef.current, 0.1);

        if (cameraTargetRef.current)
        {
            cameraTargetRef.current.getWorldPosition(cameraLookAtWorldPositionRef.current);
            cameraLookAtRef.current.lerp(cameraLookAtWorldPositionRef.current, 0.1);
            camera.lookAt(cameraLookAtRef.current);
        }
    });

    return (
        <RigidBody colliders={false} lockRotations ref={rigidBodyRef}>
            <group ref={containerRef}>
                <group ref={cameraTargetRef} position={[0, 0, 1.5]} />
                <group ref={cameraPositionRef} position={[0, 4, -4]} />
                <group ref={characterRef}>
                    <Character scale={0.18} position-y={-0.25} animation={"idle"} />
                </group>
            </group>
            <CapsuleCollider args={[0.08, 0.154]} />
        </RigidBody>
    );
};