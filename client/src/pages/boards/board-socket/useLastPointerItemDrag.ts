import { useEffect, useRef } from "react";

export function usePointerItemDrag(divRef: React.RefObject<HTMLDivElement | null>) {
    // const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);
    const ref = useRef<{ x:number; y:number } | null>(null);        
      useEffect(() => {
        const h = () => { 
            if (divRef.current) {
                const rect = divRef.current.getBoundingClientRect();
                ref.current = { x: rect.left, y: rect.top };
            }
        };
        document.addEventListener('pointermove', h);        
        return () => { 
            document.removeEventListener('pointermove', h);             
        };
      }, [divRef]);
      return ref;    
}
