import { useEffect, useRef, useState } from "react";


export default function useIntersector<T extends HTMLElement>({threshold, root = null}: {threshold: number | number[], root?: Element | null} ){
    const [isIntersecting, setIsIntersecting] = useState(false);
    const [entry, setEntry] = useState<IntersectionObserverEntry>();
    const elementRef = useRef<T>(null) 

    const options = {
        threshold: threshold,
        root: root
    }

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting)
            setEntry(entry)
        }, options)

        if(elementRef.current){
            observer.observe(elementRef.current)
        }

        return () => {
            if(elementRef.current){
                observer.unobserve(elementRef.current)
            }
        }
    }, [elementRef.current])

    return {ref: elementRef, isIntersecting, entry}
}