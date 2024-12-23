import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { KeyboardControls } from "@react-three/drei";
import { useEffect } from "react";

const keyBoardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'left', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'right', keys: ['ArrowRight', 'KeyD'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] }
];

function App() {
  useEffect(() => {
    const handleKeyUp = (event) => {
      console.log(event);
    };

    document.addEventListener("keyup", handleKeyUp);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <KeyboardControls map={keyBoardMap}>
      <Canvas
        shadows
        camera={{ position: [3, 3, 3], near: 0.1, fov: 60 }}
      >
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
