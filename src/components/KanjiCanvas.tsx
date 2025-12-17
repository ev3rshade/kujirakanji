import { useRef, useState, useEffect } from 'react';

export interface StrokePoint { x: number; y: number; }

export interface KanjiStrokes {
  [kanjiId: string]: StrokePoint[][];
}


interface KanjiCanvasProps {
  strokeHint?: StrokePoint[][]; // optional overlay
  onComplete?: (strokes: StrokePoint[][]) => void;
}

export default function KanjiCanvas({ strokeHint, onComplete }: KanjiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<StrokePoint[][]>([]);
  const [currentStroke, setCurrentStroke] = useState<StrokePoint[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';

    const drawStrokes = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // draw hint strokes first
      if (strokeHint) {
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        strokeHint.forEach(stroke => {
          ctx.beginPath();
          stroke.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
          ctx.stroke();
        });
      }

      // draw user strokes
      ctx.strokeStyle = 'black';
      strokes.forEach(stroke => {
        ctx.beginPath();
        stroke.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      });

      // draw current stroke
      if (currentStroke.length) {
        ctx.beginPath();
        currentStroke.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
        ctx.stroke();
      }
    };

    drawStrokes();
  }, [strokes, currentStroke, strokeHint]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    let drawing = false;

    const start = (e: PointerEvent) => {
      drawing = true;
      setCurrentStroke([{ x: e.offsetX, y: e.offsetY }]);
    };

    const move = (e: PointerEvent) => {
      if (!drawing) return;
      setCurrentStroke(prev => [...prev, { x: e.offsetX, y: e.offsetY }]);
    };

    const end = () => {
      if (!drawing) return;
      drawing = false;
      setStrokes(prev => [...prev, currentStroke]);
      setCurrentStroke([]);
      if (onComplete) onComplete([...strokes, currentStroke]);
    };

    canvas.addEventListener('pointerdown', start);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', end);

    return () => {
      canvas.removeEventListener('pointerdown', start);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', end);
    };
  }, [currentStroke, strokes, onComplete]);

  const clearCanvas = () => {
    setStrokes([]);
    setCurrentStroke([]);
  };

  return (
    <div>
      <canvas ref={canvasRef} width={300} height={300} style={{ border: '1px solid black' }} />
      <button onClick={clearCanvas}>Clear</button>
    </div>
  );
}