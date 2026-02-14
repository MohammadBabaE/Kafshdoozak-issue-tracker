import { useEffect, useState } from "react";
import useDebounceCallback from "./useDebounceCallback";


export default function useDebounce<T>(toDebounce: T , debounceTime: number){
    const [value, setValue] = useState(toDebounce)
    
    const debouncedValue = useDebounceCallback(setValue, debounceTime);
    useEffect(() => {
            debouncedValue(toDebounce);
    }, [toDebounce, debounceTime]);
    
    return value;
}